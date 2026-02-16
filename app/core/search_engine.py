"""Search Engine Module with Semantic Embeddings."""
from typing import Optional
import pandas as pd
import numpy as np

from app.data.loader import load_course_data
from app.config.settings import COLUMNS, USE_OPENAI_EMBEDDING, OPENAI_API_KEY

_model = None
_openai_client = None
_course_embeddings = None
_course_texts = None


def get_model():
    """Load or return cached embedding model."""
    global _model, _openai_client

    if USE_OPENAI_EMBEDDING:
        # OpenAI text-embedding-3-small
        if _openai_client is None:
            from openai import OpenAI
            print("[Info] Using OpenAI text-embedding-3-small model...")
            _openai_client = OpenAI(api_key=OPENAI_API_KEY)
            print("[OK] OpenAI client ready!")
        return _openai_client
    else:
        # Local MiniLM model
        if _model is None:
            try:
                from sentence_transformers import SentenceTransformer
                model_name = "all-MiniLM-L6-v2"
                print(f"[Info] Loading embedding model ({model_name})...")
                _model = SentenceTransformer(model_name)
                print("[OK] Embedding model loaded!")
            except ImportError:
                print("[Error] sentence-transformers not found. Please set USE_OPENAI_EMBEDDING=true on Vercel.")
                raise ImportError("Local embedding model dependencies are missing. Use OpenAI embeddings for deployment.")
        return _model


def _openai_encode(texts: list[str]) -> np.ndarray:
    """Encode texts using OpenAI embedding API."""
    response = _openai_client.embeddings.create(
        input=texts,
        model="text-embedding-3-small"
    )
    return np.array([item.embedding for item in response.data])


def encode_texts(texts: list[str], show_progress: bool = False) -> np.ndarray:
    """Encode texts using the configured embedding model."""
    model = get_model()

    if USE_OPENAI_EMBEDDING:
        # OpenAI API — batch in chunks of 100 to avoid token limits
        all_embeddings = []
        batch_size = 100
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            all_embeddings.append(_openai_encode(batch))
        return np.vstack(all_embeddings)
    else:
        # MiniLM via SentenceTransformer
        return model.encode(texts, show_progress_bar=show_progress)


def get_course_embeddings():
    """Generate and cache embeddings for all courses."""
    global _course_embeddings, _course_texts
    
    if _course_embeddings is not None:
        return _course_embeddings, _course_texts
    
    df = load_course_data()
    if df.empty:
        return None, None
    
    _course_texts = []
    for _, row in df.iterrows():
        text_parts = [
            str(row.get(COLUMNS["course_name"], "")),
            str(row.get(COLUMNS["department"], "")),
            str(row.get(COLUMNS["skills"], "")),
            str(row.get(COLUMNS["industry_domain"], "")),
            str(row.get(COLUMNS["course_type"], "")),
            str(row.get(COLUMNS["course_pathway"], "")),
            str(row.get(COLUMNS["course_level"], "")),
            str(row.get(COLUMNS["job_role"], ""))
        ]
        text_parts = [p for p in text_parts if p and p.lower() != 'nan']
        _course_texts.append(" | ".join(text_parts))
    
    print(f"[Info] Generating embeddings for {len(_course_texts)} courses...")
    _course_embeddings = encode_texts(_course_texts, show_progress=True)
    print("[OK] Course embeddings generated!")
    
    return _course_embeddings, _course_texts


class CourseSearchEngine:
    """Semantic search engine for courses using embeddings."""
    
    def __init__(self):
        self.min_similarity = 0.30
        self.max_results = 5
    
    def search(self, query: str) -> dict:
        """Search for courses matching the query using semantic similarity."""
        if not query or not query.strip():
            return self._not_found_response()
        
        df = load_course_data()
        if df.empty:
            return self._not_found_response("Data file could not be loaded.")
        
        course_embeddings, course_texts = get_course_embeddings()
        if course_embeddings is None:
            return self._not_found_response("Failed to generate embeddings.")
        
        model = get_model()
        
        query_embedding = encode_texts([query])[0]
        
        # Cosine similarity using numpy (works for both OpenAI and MiniLM)
        query_norm = query_embedding / (np.linalg.norm(query_embedding) + 1e-10)
        emb_norms = course_embeddings / (np.linalg.norm(course_embeddings, axis=1, keepdims=True) + 1e-10)
        similarities = np.dot(emb_norms, query_norm)
        
        valid_indices = np.where(similarities >= self.min_similarity)[0]
        
        if len(valid_indices) == 0:
            return self._not_found_response()
        
        sorted_indices = valid_indices[np.argsort(similarities[valid_indices])[::-1]]
        top_indices = sorted_indices[:self.max_results]
        
        results = []
        for idx in top_indices:
            row = df.iloc[idx]
            course_dict = self._row_to_dict(row)
            course_dict["similarity_score"] = float(similarities[idx])
            results.append(course_dict)
        
        highest_sim = similarities[top_indices[0]]
        if highest_sim >= 0.70:
            match_type = "exact"
        elif highest_sim >= 0.40:
            match_type = "partial"
        else:
            match_type = "related"
        
        return self._success_response(results, match_type)
    
    def _row_to_dict(self, row: pd.Series) -> dict:
        """Convert a DataFrame row to response dictionary."""
        return {
            "Course Name": str(row.get(COLUMNS["course_name"], "")),
            "Department": str(row.get(COLUMNS["department"], "")),
            "Skills": str(row.get(COLUMNS["skills"], "")),
            "Industry Domain": str(row.get(COLUMNS["industry_domain"], "")),
            "Course type": str(row.get(COLUMNS["course_type"], "")),
            "Course Pathway": str(row.get(COLUMNS["course_pathway"], "")),
            "Course Level": str(row.get(COLUMNS["course_level"], "")),
            "Job role to skill": str(row.get(COLUMNS["job_role"], ""))
        }
    
    def _success_response(self, courses: list[dict], match_type: str) -> dict:
        """Build success response."""
        return {
            "status": "success",
            "matched_type": match_type,
            "total_results": len(courses),
            "courses": courses
        }
    
    def _not_found_response(self, message: Optional[str] = None) -> dict:
        """Build not found response."""
        return {
            "status": "not_found",
            "message": message or "Sorry, I couldn't find any courses matching that. Try checking your spelling or ask for a broader topic."
        }


search_engine = CourseSearchEngine()


def search_courses(query: str) -> dict:
    """Convenience function to search courses."""
    return search_engine.search(query)


def preload_embeddings():
    """Preload model and embeddings."""
    get_model()
    get_course_embeddings()
