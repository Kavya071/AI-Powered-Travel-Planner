import streamlit as st
import cohere

# Fetch the API key from Streamlit secrets
api_key = st.secrets["general"]["cohere_api_key"]

# Initialize Cohere client
co = cohere.Client(api_key)


# Streamlit App
st.title("AI-Powered Travel Planner")

# Step 1: User Inputs
st.header("Plan Your Dream Trip")

destination = st.text_input("Where are you traveling?")
days = st.number_input("How many days is your trip?", min_value=1, step=1)
budget = st.selectbox("What is your budget?", ["Low", "Moderate", "High"])
preferences = st.text_area("What are your preferences? (e.g., museums, food, shopping)")
dietary_restrictions = st.text_input("Any dietary restrictions?")
mobility_concerns = st.selectbox("Do you have mobility concerns?", ["No", "Yes"])

if st.button("Generate Itinerary"):
    if not destination or days <= 0 or not preferences:
        st.error("Please fill out all required fields.")
    else:
        # Step 2: Generate Prompt for Cohere
        prompt = (
            f"Create a {days}-day itinerary for a trip to {destination}. "
            f"The user has a {budget.lower()} budget and prefers {preferences}. "
            f"Dietary restrictions: {dietary_restrictions}. "
            f"Mobility concerns: {mobility_concerns}. "
            "Provide a detailed day-by-day plan."
        )

        try:
            # Cohere API Call
            response = co.generate(
        model='command-xlarge',  # Try using a smaller model
        prompt=prompt,
        max_tokens=1000,
        temperature=0.7
        )


            # Display Itinerary
            itinerary = response.generations[0].text
            st.subheader("Your Personalized Itinerary:")
            st.write(itinerary)
        except Exception as e:
            st.error(f"Error generating itinerary: {e}")
