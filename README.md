I'll help you rewrite this into clear bullet points and generate prompts for both Vercel v0 and OpenAI Codex.

## Rewritten Requirements - Clear Points

**Project Overview:**
- Building an AI-powered refrigerator companion app for a refrigerator company
- Goal: Increase refrigerator sales during Christmas season
- Core feature: Identify food items and suggest recipes

**Key Features:**

1. **Food Recognition**
   - Upload food images from device
   - Take photos directly in-app
   - Copy/paste images
   - Validate that uploaded images contain food items
   - Clear error messages for non-food items

2. **Recipe Generation**
   - Generate at least 5 different recipes per query
   - Filter by dietary preferences: Healthy, Vegetarian, Non-Vegetarian
   - Filter by cuisine type
   - Filter by calorie requirements
   - Show nutritional information
   - Highlight foods that aid weight loss
   - Use Gemini Flash for recipe generation

3. **Recipe Management**
   - Save recipes as favorites
   - Access saved recipes later

4. **Health Section**
   - Dedicated section for healthy eating
   - Focus on high-protein options

5. **Settings**
   - API configuration page
   - Configure Gemini 2.5 Pro settings
   - Configure Google AI Studio settings

**Technical Requirements:**
- Use Gemini 2.5 Pro and Google AI Studio
- Use Gemini Flash for recipe generation
- Simple, user-friendly UI
- Robust error handling

---

## Prompt for Vercel v0

```
Create a modern refrigerator companion web app with the following features:

CORE FUNCTIONALITY:
- Food image recognition system with 3 input methods: file upload, camera capture, copy-paste
- Generate 5+ recipes based on identified ingredients
- Recipe filtering: dietary preferences (healthy/vegetarian/non-vegetarian), cuisine types, calorie targets
- Display nutritional information and weight-loss friendly ingredients
- Favorite/save recipe functionality
- Dedicated "Healthy Eating" section highlighting high-protein options

UI REQUIREMENTS:
- Clean, minimalist design with intuitive navigation
- Home page with prominent image upload options (upload button, camera button, paste area)
- Recipe cards displaying: title, image, prep time, calories, nutrition highlights
- Filter sidebar or dropdown for dietary/cuisine/calorie preferences
- Settings page for API configuration (Gemini API keys)
- Error states with friendly messages for non-food images
- Loading states during image analysis and recipe generation

LAYOUT STRUCTURE:
- Header with logo and navigation (Home, Saved Recipes, Healthy Eating, Settings)
- Main content area for image upload or recipe results
- Recipe display grid (responsive, 2-3 columns)
- Bottom navigation for mobile
- Modal for recipe details with save/favorite button

COLOR SCHEME: Modern, food-friendly palette (greens, whites, warm accents)
STYLE: Contemporary, card-based UI with smooth transitions
```

---

## Prompt for OpenAI Codex (Python)

```python
"""
Create a Python backend for a refrigerator companion AI app with the following specifications:

TECH STACK:
- Python 3.10+
- Google Gemini 2.5 Pro for food recognition
- Google Gemini Flash for recipe generation
- Google AI Studio integration
- FastAPI or Flask for REST API

REQUIRED ENDPOINTS:

1. POST /api/recognize-food
   - Accept image upload (file, base64, URL)
   - Validate image contains food items
   - Use Gemini 2.5 Pro to identify ingredients
   - Return: list of ingredients, confidence scores
   - Error handling: return clear message if non-food image

2. POST /api/generate-recipes
   - Input: ingredients list, dietary_preference, cuisine_type, calorie_target
   - Use Gemini Flash to generate 5+ recipes
   - Return: recipe array with:
     * title, description, ingredients, instructions
     * nutritional info (calories, protein, carbs, fats)
     * weight_loss_friendly flag
     * preparation time, difficulty level
   
3. GET/POST /api/favorites
   - Save and retrieve favorite recipes
   - Store in SQLite or JSON file

4. GET /api/healthy-recipes
   - Return high-protein, healthy recipes
   - Filter by protein content > 20g per serving

5. POST /api/settings
   - Configure API keys for Gemini 2.5 Pro and Gemini Flash
   - Store securely (environment variables or encrypted config)

ERROR HANDLING:
- Image validation (file type, size, content)
- API rate limiting
- Gemini API error handling with fallbacks
- User-friendly error messages

FEATURES:
- Image preprocessing (resize, format conversion)
- Caching for repeated ingredient recognition
- Recipe nutrition calculation
- Dietary filter logic (vegetarian, non-vegetarian, healthy)
- Calorie-based recipe filtering

STRUCTURE:
- /models: Data models for recipes, ingredients
- /services: Gemini API integration, image processing
- /routes: API endpoints
- /utils: Helper functions, validators
- /config: API configuration, settings management
- requirements.txt with all dependencies

Include comprehensive error handling, logging, and API documentation.
"""
```

---

## Additional Implementation Notes

**For Gemini Integration:**
- Use `gemini-2.5-pro` model for food recognition (higher accuracy)
- Use `gemini-flash-1.5` for recipe generation (faster, cost-effective)
- Implement retry logic for API failures
- Set appropriate temperature (0.7-0.9) for creative recipe generation

**Database Schema Suggestions:**
- Users table (if authentication needed)
- Recipes table (id, title, ingredients, instructions, nutrition, created_at)
- Favorites table (user_id, recipe_id, saved_at)
- API_Settings table (encrypted keys)

**Security Considerations:**
- Validate image file types (JPEG, PNG, WebP)
- Limit file upload size (max 10MB)
- Sanitize user inputs
- Use environment variables for API keys
- Implement rate limiting

Would you like me to create a detailed technical specification document or help with any specific component of this application?# bus25-fridgeChef-vercelV0
