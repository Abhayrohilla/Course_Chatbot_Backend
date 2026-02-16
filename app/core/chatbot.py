"""Smart Chatbot with Course Recommendation - keyword/pattern based system."""
import random

GREETINGS = ['hi', 'hello', 'hey', 'hii', 'good morning', 'good evening', 'greetings']

CONVERSATION_PATTERNS = [
    'what are you', 'who are you', 'how are you',
    'what do you do', 'what can you do',
    'are you', 'do you', 'can you',
    'your name', 'help me', 'what is this',
    'how does', 'what does', 'tell me about yourself',
    'nice to meet', 'good to see', 'bye', 'goodbye', 'see you',
    'ok', 'okay', 'alright', 'cool', 'great', 'awesome',
    'yes', 'no', 'maybe', 'sure', 'fine',
    'weather', 'time', 'date', 'news',
    'thank', 'thanks', 'appreciate'
]

RESPONSES = {
    'greeting': [
        "Hello! I'm Course Buddy. How can I help you find a course today?",
        "Hi there! I'm here to help you discover courses. What would you like to learn?",
        "Greetings! Tell me what skills you want to develop, and I'll find the right courses."
    ],
    'who_are_you': [
        "I'm Course Buddy, an AI assistant that helps students find the perfect courses for their career goals. What would you like to learn?",
        "I'm your personal course recommendation assistant. Tell me your interests, and I'll find relevant courses!"
    ],
    'what_doing': [
        "I'm ready to help you discover courses! What topic or skill are you interested in?",
        "I'm here waiting to help you find your next learning opportunity. What would you like to explore?"
    ],
    'how_are_you': [
        "I'm doing great, thank you for asking! How can I help you find a course today?",
        "I'm ready to assist! What topic are you interested in learning about?"
    ],
    'thank_you': [
        "You're welcome! Let me know if you need more course recommendations.",
        "Glad I could help! Best of luck with your learning journey!"
    ],
    'capabilities': [
        "I can help you find courses based on your interests, skills, or career goals. Just tell me what you want to learn!",
        "I specialize in recommending courses. Try asking me about topics like 'AI courses', 'data science', or 'marketing'."
    ],
    'goodbye': [
        "Goodbye! Feel free to come back whenever you need course recommendations.",
        "See you later! Good luck with your learning journey!"
    ]
}


def process_chat(query: str, chat_history: list = None) -> dict:
    """Process user message. Returns action: 'chat' or 'search'."""
    query_lower = query.lower().strip()
    
    for greeting in GREETINGS:
        if query_lower.startswith(greeting) or query_lower == greeting:
            return {"action": "chat", "message": random.choice(RESPONSES['greeting'])}
    
    for pattern in CONVERSATION_PATTERNS:
        if pattern in query_lower:
            if 'who are you' in query_lower or 'your name' in query_lower:
                return {"action": "chat", "message": random.choice(RESPONSES['who_are_you'])}
            if 'what are you' in query_lower or 'what do you' in query_lower:
                return {"action": "chat", "message": random.choice(RESPONSES['what_doing'])}
            if 'how are you' in query_lower:
                return {"action": "chat", "message": random.choice(RESPONSES['how_are_you'])}
            if 'what can you' in query_lower or 'can you help' in query_lower:
                return {"action": "chat", "message": random.choice(RESPONSES['capabilities'])}
            if 'bye' in query_lower or 'goodbye' in query_lower or 'see you' in query_lower:
                return {"action": "chat", "message": random.choice(RESPONSES['goodbye'])}
            if any(t in query_lower for t in ['thank', 'thanks']):
                return {"action": "chat", "message": random.choice(RESPONSES['thank_you'])}
            return {"action": "chat", "message": random.choice(RESPONSES['capabilities'])}
    
    return {"action": "search", "search_query": query}


def generate_course_intro(query: str, courses: list) -> str:
    """Generate a friendly intro for course results."""
    if not courses:
        return None
    count = len(courses)
    intros = [
        f"Here are {count} courses that match your search:",
        f"I found {count} relevant courses for you:",
        f"Great news! Here are {count} courses related to your query:"
    ]
    return random.choice(intros)
