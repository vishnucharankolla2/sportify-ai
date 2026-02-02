import streamlit as st
import requests
import json
from datetime import datetime

# Page config
st.set_page_config(page_title="Sportify AI - Testing", layout="wide", initial_sidebar_state="expanded")

# Custom styling
st.markdown("""
<style>
    .main-header { font-size: 3em; color: #1f77b4; }
    .metric { background-color: #f0f2f6; padding: 20px; border-radius: 10px; }
    .recommendation-box { border-left: 4px solid #1f77b4; padding: 15px; margin: 10px 0; background-color: #f8f9fa; }
</style>
""", unsafe_allow_html=True)

# Sidebar config
with st.sidebar:
    st.title("⚙️ Configuration")
    api_url = st.text_input("API Base URL", value="http://localhost:3000/api", help="Enter the backend API URL")
    st.markdown("---")
    
    if st.button("🔗 Test Connection", use_container_width=True):
        try:
            response = requests.get(f"{api_url}/health", timeout=5)
            if response.status_code == 200:
                st.success("✅ Connected to backend!")
            else:
                st.error(f"❌ Backend responded with status {response.status_code}")
        except Exception as e:
            st.error(f"❌ Connection failed: {str(e)}")

# Main header
st.markdown('<h1 class="main-header">⚽ Sportify AI - Intelligence Platform</h1>', unsafe_allow_html=True)
st.markdown("### Global Football Intelligence & Club Matchmaking Engine")

# Tabs for different features
tab1, tab2, tab3, tab4, tab5 = st.tabs(["🎯 Recommendations", "👥 Players", "🏟️ Clubs", "📰 News", "📊 Analytics"])

# ================== TAB 1: RECOMMENDATIONS ==================
with tab1:
    st.header("Player Recommendations Engine")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Get Club Needs")
        clubs = ["Manchester City", "Liverpool", "Real Madrid", "Barcelona", "Juventus", "PSG"]
        selected_club = st.selectbox("Select Club", clubs)
        
        if st.button("Fetch Club Needs", key="fetch_needs", use_container_width=True):
            try:
                response = requests.get(f"{api_url}/clubs", timeout=10)
                if response.status_code == 200:
                    clubs_data = response.json()
                    matching_club = next((c for c in clubs_data if c.get('name') == selected_club), None)
                    if matching_club:
                        st.json(matching_club)
                    else:
                        st.warning("Club not found")
                else:
                    st.error("Failed to fetch clubs")
            except Exception as e:
                st.error(f"Error: {str(e)}")
    
    with col2:
        st.subheader("Generate Recommendations")
        num_recommendations = st.slider("Number of Recommendations", 1, 10, 5)
        position_filter = st.multiselect("Filter by Position", ["Forward", "Midfielder", "Defender", "Goalkeeper"])
        
        if st.button("Generate Recommendations", use_container_width=True):
            try:
                payload = {
                    "club_id": 1,
                    "limit": num_recommendations
                }
                if position_filter:
                    payload["positions"] = position_filter
                
                response = requests.post(
                    f"{api_url}/recommendations",
                    json=payload,
                    timeout=15
                )
                
                if response.status_code == 201:
                    recommendations = response.json()
                    st.success(f"Generated {len(recommendations.get('recommendations', []))} recommendations")
                    
                    for rec in recommendations.get('recommendations', [])[:5]:
                        with st.container():
                            st.markdown('<div class="recommendation-box">', unsafe_allow_html=True)
                            col_a, col_b = st.columns([3, 1])
                            
                            with col_a:
                                st.markdown(f"### {rec.get('player_name')} ({rec.get('position')})")
                                st.markdown(f"**Club:** {rec.get('current_club')} | **Age:** {rec.get('age')}")
                                st.markdown(f"**Match Score:** {rec.get('match_score', 0):.1f}%")
                                if rec.get('explanation'):
                                    st.caption(f"💡 {rec.get('explanation')}")
                            
                            with col_b:
                                st.metric("Fit Score", f"{rec.get('fit_score', 0):.1f}%")
                            
                            st.markdown('</div>', unsafe_allow_html=True)
                else:
                    st.error(f"API Error: {response.status_code}")
            except Exception as e:
                st.error(f"Error: {str(e)}")

# ================== TAB 2: PLAYERS ==================
with tab2:
    st.header("Player Database")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        search_name = st.text_input("Search by Player Name")
    
    with col2:
        position_filter = st.selectbox("Filter by Position", ["All", "Forward", "Midfielder", "Defender", "Goalkeeper"])
    
    with col3:
        age_range = st.slider("Age Range", 18, 40, (22, 35))
    
    if st.button("Search Players", use_container_width=True):
        try:
            params = {
                "limit": 20,
                "min_age": age_range[0],
                "max_age": age_range[1]
            }
            if position_filter != "All":
                params["position"] = position_filter
            if search_name:
                params["search"] = search_name
            
            response = requests.get(f"{api_url}/players", params=params, timeout=10)
            
            if response.status_code == 200:
                players = response.json()
                st.success(f"Found {len(players)} players")
                
                df_data = []
                for p in players:
                    df_data.append({
                        "Name": p.get('name'),
                        "Position": p.get('position'),
                        "Club": p.get('club'),
                        "Age": p.get('age'),
                        "Rating": p.get('rating', 'N/A'),
                        "Availability": "✅" if p.get('is_available') else "❌"
                    })
                
                if df_data:
                    st.dataframe(df_data, use_container_width=True)
            else:
                st.error("Failed to fetch players")
        except Exception as e:
            st.error(f"Error: {str(e)}")

# ================== TAB 3: CLUBS ==================
with tab3:
    st.header("Club Profiles")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("Load All Clubs", use_container_width=True):
            try:
                response = requests.get(f"{api_url}/clubs", timeout=10)
                
                if response.status_code == 200:
                    clubs_data = response.json()
                    
                    for club in clubs_data:
                        with st.expander(f"🏟️ {club.get('name')}"):
                            col_x, col_y = st.columns(2)
                            
                            with col_x:
                                st.markdown(f"**Country:** {club.get('country')}")
                                st.markdown(f"**Founded:** {club.get('founded_year')}")
                                st.markdown(f"**League:** {club.get('league')}")
                            
                            with col_y:
                                st.markdown(f"**Budget:** ${club.get('budget', 'N/A')}M")
                                st.markdown(f"**Stadium:** {club.get('stadium')}")
                else:
                    st.error("Failed to fetch clubs")
            except Exception as e:
                st.error(f"Error: {str(e)}")
    
    with col2:
        st.markdown("### Club Needs Management")
        selected_club = st.selectbox("Select Club for Needs", clubs)
        
        if st.button("View Club Needs", use_container_width=True):
            try:
                response = requests.get(f"{api_url}/clubs/needs/{1}", timeout=10)  # Assuming ID=1
                
                if response.status_code == 200:
                    needs = response.json()
                    st.json(needs)
                else:
                    st.info("No specific needs configured")
            except Exception as e:
                st.warning(f"Could not fetch needs: {str(e)}")

# ================== TAB 4: NEWS ==================
with tab4:
    st.header("News & Events Intelligence")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("Latest Football News")
    
    with col2:
        if st.button("Refresh News", use_container_width=True):
            pass  # Trigger news refresh
    
    if st.button("Load News Articles", use_container_width=True):
        try:
            response = requests.get(f"{api_url}/news", params={"limit": 10}, timeout=10)
            
            if response.status_code == 200:
                articles = response.json()
                
                for article in articles:
                    with st.container():
                        st.markdown(f"### {article.get('title')}")
                        
                        col_a, col_b = st.columns([3, 1])
                        with col_a:
                            st.caption(f"Source: {article.get('source')} | {article.get('published_date')}")
                            st.write(article.get('summary', 'No summary available')[:200] + "...")
                        
                        with col_b:
                            confidence = article.get('confidence_score', 0)
                            if confidence > 0.8:
                                st.success(f"Confidence: {confidence:.0%}")
                            elif confidence > 0.6:
                                st.warning(f"Confidence: {confidence:.0%}")
                            else:
                                st.info(f"Confidence: {confidence:.0%}")
                        
                        st.divider()
            else:
                st.error("Failed to fetch news")
        except Exception as e:
            st.error(f"Error: {str(e)}")

# ================== TAB 5: ANALYTICS ==================
with tab5:
    st.header("Analytics & Metrics")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Players", "6", "+2 this week")
    
    with col2:
        st.metric("Total Clubs", "6", "Stable")
    
    with col3:
        st.metric("Recommendations", "24", "+8 pending")
    
    with col4:
        st.metric("News Articles", "12", "+3 today")
    
    st.divider()
    
    st.subheader("System Health")
    if st.button("Check API Status", use_container_width=True):
        try:
            response = requests.get(f"{api_url}/health", timeout=5)
            if response.status_code == 200:
                health = response.json()
                
                col_h1, col_h2 = st.columns(2)
                with col_h1:
                    st.success("✅ API Online")
                    st.json(health)
                with col_h2:
                    st.info("Last Check: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        except Exception as e:
            st.error(f"❌ API Unavailable: {str(e)}")
    
    st.markdown("---")
    st.markdown("""
    ### 📚 Documentation
    - **GitHub:** https://github.com/vishnucharankolla2/sportify-ai
    - **API Docs:** See backend/docs/API.md
    - **Database:** PostgreSQL with 13 optimized tables
    - **LLM:** OpenAI GPT-4 for intelligent extraction
    """)

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #888; font-size: 0.9em;'>
    <p>Sportify AI - Global Football Intelligence & Club Matchmaking Engine</p>
    <p>Powered by OpenAI GPT-4 | Built with Streamlit | Deployed on Hugging Face Spaces</p>
</div>
""", unsafe_allow_html=True)
