"""Data Loader Module - Loads course data from Excel file."""
import pandas as pd
from typing import Optional
from app.config.settings import EXCEL_FILE_PATH, COLUMNS

_cached_data: Optional[pd.DataFrame] = None


def load_course_data(force_reload: bool = False) -> pd.DataFrame:
    """Load course data from Excel file with caching."""
    global _cached_data
    
    if _cached_data is not None and not force_reload:
        return _cached_data
    
    try:
        df = pd.read_excel(EXCEL_FILE_PATH)
        df.columns = df.columns.str.strip()
        
        for col in df.columns:
            if df[col].dtype == object:
                df[col] = df[col].fillna("").astype(str).str.strip()
        
        _cached_data = df
        print(f"[OK] Loaded {len(df)} courses from Excel")
        return df
        
    except FileNotFoundError:
        print(f"[Error] Excel file not found: {EXCEL_FILE_PATH}")
        return pd.DataFrame()
    except Exception as e:
        print(f"[Error] loading Excel: {e}")
        return pd.DataFrame()


def get_all_courses() -> list[dict]:
    """Get all courses as list of dictionaries."""
    df = load_course_data()
    return df.to_dict(orient='records')


def get_unique_values(column: str) -> list:
    """Get unique values from a column."""
    df = load_course_data()
    if column in df.columns:
        return df[column].dropna().unique().tolist()
    return []
