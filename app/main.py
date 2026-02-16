"""Academic Course Recommendation AI Backend - FastAPI Application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.search_engine import search_courses, preload_embeddings
from app.data.loader import load_course_data, get_unique_values

app = FastAPI(
    title="Academic Course Recommendation API",
    description="Intelligent course search and recommendation backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str


@app.on_event("startup")
async def startup_event():
    """Load course data on startup. Embeddings will be lazy-loaded on first request."""
    print("Startup: Loading course data...")
    df = load_course_data()
    print(f"Loaded {len(df)} courses")
    # preload_embeddings()  # Disabled for Vercel to avoid timeout
    print("API is ready and waiting for requests!")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Course Recommendation API is running"}


@app.post("/api/search")
async def search(request: SearchRequest):
    """Intelligent chat endpoint with course recommendation."""
    if not request.query or not request.query.strip():
        return {"status": "chat", "message": "Please type a message to get started!"}
    
    clean_query = request.query
    prefixes = ["Try searching for:", "Try searching for"]
    for prefix in prefixes:
        if clean_query.lower().startswith(prefix.lower()):
            clean_query = clean_query[len(prefix):].strip()
            
    from app.core.chatbot import process_chat, generate_course_intro
    
    ai_result = process_chat(clean_query)
    
    if ai_result["action"] == "chat":
        return {"status": "chat", "message": ai_result["message"]}
    
    elif ai_result["action"] == "search":
        search_query = ai_result.get("search_query", clean_query)
        result = search_courses(search_query)
        
        if result.get("status") == "success" and result.get("courses"):
            intro = generate_course_intro(clean_query, result["courses"])
            if intro:
                result["ai_message"] = intro
        
        return result
    
    return search_courses(clean_query)


@app.get("/api/filters")
async def get_filters():
    """Get available filter options for frontend dropdowns."""
    return {
        "departments": get_unique_values("Department"),
        "course_levels": get_unique_values("Course Level"),
        "industry_domains": get_unique_values("Industry Domain"),
        "course_types": get_unique_values("Course type")
    }


@app.get("/api/courses/all")
async def get_all_courses():
    """Get all courses."""
    df = load_course_data()
    return {
        "status": "success",
        "total_courses": len(df),
        "courses": df.to_dict(orient='records')
    }


@app.get("/api/suggestions")
async def get_suggestions():
    """Get dynamic suggestions based on actual course data."""
    df = load_course_data()
    suggestions = []
    
    levels = df['Course Level'].dropna().unique().tolist()
    if 'Beginner' in levels:
        suggestions.append("Beginner courses")
    elif levels:
        suggestions.append(f"{levels[0]} courses")
    
    priority_topics = ["Communication", "Rural & culture", "Education"]
    for topic in priority_topics:
        if topic not in suggestions:
            suggestions.append(topic)
            
    if len(suggestions) < 4:
        departments = df['Department'].dropna().value_counts().head(10).index.tolist()
        for dept in departments:
            dept_str = str(dept).split('(')[0].strip()
            if len(dept_str) < 20 and dept_str not in suggestions:
                suggestions.append(dept_str)
                if len(suggestions) >= 4: break
    
    return {"suggestions": suggestions[:4]}
