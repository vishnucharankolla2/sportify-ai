# 🚀 Deploy Sportify AI to Hugging Face Spaces

## Step-by-Step Deployment Guide

### Prerequisites
- Hugging Face account (free at https://huggingface.co)
- GitHub account with access to your repo
- Your backend API deployed somewhere accessible (or local IP if testing locally)

---

## Method 1: Automatic Deployment (Recommended)

### Step 1: Create a New Space on Hugging Face

1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Fill in the details:
   - **Space name:** `sportify-ai-testing`
   - **License:** `openrail`
   - **Space SDK:** `Docker` (or `Streamlit` for simpler setup)
   - **Visibility:** `Public` (for testing)

### Step 2: Connect GitHub Repository

1. In the Space settings, under **"Repository details"**
2. Click **"Link to a repo"**
3. Select your fork/repository: `vishnucharankolla2/sportify-ai`
4. Choose branch: `main`
5. Set Docker path to: `hf-space/`

### Step 3: Configure Environment Variables

1. Go to **Space Settings** → **Variables and secrets**
2. Add the following environment variables:
   ```
   API_URL=http://localhost:3000/api  (change to your deployed API URL)
   API_TIMEOUT=30
   ```

### Step 4: Deploy

- Save settings
- Hugging Face will automatically:
  1. Clone your GitHub repo
  2. Build the Docker container
  3. Deploy the Space
  4. Provide a public URL

**Your Space will be live at:**
```
https://huggingface.co/spaces/YOUR_USERNAME/sportify-ai-testing
```

---

## Method 2: Manual Hugging Face Git Deployment

### Step 1: Install Hugging Face CLI

```bash
pip install huggingface-hub
huggingface-cli login
# Enter your Hugging Face API token when prompted
```

### Step 2: Create a Space Repository

```bash
huggingface-cli repo create sportify-ai-testing --type space --space-sdk streamlit
```

### Step 3: Clone and Configure

```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/sportify-ai-testing
cd sportify-ai-testing
```

### Step 4: Copy Files

Copy these from your Sportify AI project:
```bash
cp -r ../sportify-ai/hf-space/* .
```

Ensure you have:
- `app.py` (Streamlit app)
- `requirements.txt` (dependencies)
- `README.md` (documentation)

### Step 5: Commit and Push

```bash
git add .
git commit -m "Deploy Sportify AI testing interface to HF Spaces"
git push
```

**Result:** Hugging Face automatically builds and deploys

---

## Method 3: Docker Deployment (For Custom Backend)

If you want to deploy the entire stack (API + Frontend) on Hugging Face Spaces:

### Create a Dockerfile in `hf-space/`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the Streamlit app
COPY app.py .

# Create streamlit config
RUN mkdir -p ~/.streamlit
RUN echo "[server]" > ~/.streamlit/config.toml
RUN echo "headless = true" >> ~/.streamlit/config.toml
RUN echo "port = 7860" >> ~/.streamlit/config.toml

# Run the app
CMD ["streamlit", "run", "app.py", "--server.port=7860", "--server.address=0.0.0.0"]
```

Then follow Method 2 steps and Hugging Face will use this Dockerfile.

---

## Configuration for Different Deployment Scenarios

### Scenario A: API Running Locally (For Testing)

1. In the Space's README, include:
   ```
   To test with your local backend:
   1. Start your Express server: npm start
   2. Note your machine's IP: ipconfig (Windows) or ifconfig (Mac/Linux)
   3. Replace API_URL with: http://YOUR_IP:3000/api
   4. Refresh the Streamlit app
   ```

2. The Streamlit app will have a sidebar input to change API URL dynamically.

### Scenario B: API Deployed to Cloud (Production)

1. Deploy your Express backend to:
   - **Heroku** (free tier deprecated, use Railway/Render)
   - **Railway.app** (recommended for Node.js)
   - **Render.com**
   - **AWS/Google Cloud**
   - **DigitalOcean**

2. In Space environment variables, set:
   ```
   API_URL=https://your-deployed-api.herokuapp.com/api
   ```

3. Update [hf-space/app.py](hf-space/app.py) line ~13:
   ```python
   api_url = st.text_input("API Base URL", 
       value=os.getenv("API_URL", "http://localhost:3000/api"))
   ```

### Scenario C: Full Stack on Hugging Face Spaces

This is more complex but possible. You'd need:
- A Dockerfile that installs Node.js + PostgreSQL
- Database initialization scripts
- Both services running in the same container

**Not recommended** - Keep API separate for better scalability.

---

## Deployment Checklist

- [ ] Created Hugging Face account
- [ ] Forked/pushed Sportify AI to your GitHub
- [ ] Created new Space on Hugging Face
- [ ] Connected GitHub repository
- [ ] Set API_URL environment variable
- [ ] Verified Space is building (check logs)
- [ ] Tested connection with "Test Connection" button
- [ ] Generated sample recommendations
- [ ] Shared Space URL with team

---

## Testing the Deployment

Once live, test these workflows:

### Test 1: API Connection
```
Sidebar → "Test Connection" button
Expected: ✅ Connected to backend!
```

### Test 2: Search Players
```
Players tab → Enter search criteria → Search
Expected: Table with matching players
```

### Test 3: Generate Recommendations
```
Recommendations tab → Select club → Generate
Expected: 5+ recommendations with scores
```

### Test 4: View News
```
News tab → Load Articles
Expected: List of football news with confidence scores
```

---

## Troubleshooting

### Issue: "Connection Failed"
**Solution:**
- Verify API_URL is correct
- Check if backend is running
- For local testing, use your machine IP instead of localhost
- Check firewall settings

### Issue: "502 Bad Gateway"
**Solution:**
- Hugging Face Space is building - wait 2-3 minutes
- Check build logs in Space settings
- Verify requirements.txt is valid

### Issue: "API returns 404"
**Solution:**
- Verify backend routes are correct
- Check backend is running on port 3000
- Review `/backend/docs/API.md` for endpoint paths

### Issue: Streamlit app is slow
**Solution:**
- Increase timeout in sidebar
- Optimize API queries
- Cache responses if needed

---

## Sharing Your Space

Once deployed, share with your team:

1. **Get the Space URL:**
   ```
   https://huggingface.co/spaces/YOUR_USERNAME/sportify-ai-testing
   ```

2. **Share in different formats:**
   - Direct link: `Click here to test`
   - Embedded in chat: `[Test Sportify AI](https://hf.co/spaces/...)`
   - Email: Send the URL with testing instructions

3. **For production:**
   - Add authentication (optional Hugging Face feature)
   - Set visibility to "Private" if needed
   - Add password protection

---

## Next Steps

### After Successful Deployment:

1. **Gather Feedback**
   - Share with stakeholders
   - Collect testing results
   - Note bugs/feature requests

2. **Monitor Performance**
   - Check Space logs for errors
   - Monitor API response times
   - Track number of concurrent users

3. **Iterate & Improve**
   - Deploy new features
   - Update database seed data
   - Enhance UI/UX based on feedback

4. **Scale to Production**
   - Deploy backend to production server
   - Set up proper database (cloud PostgreSQL)
   - Configure CI/CD pipeline
   - Add authentication/authorization

---

## Additional Resources

- **Hugging Face Spaces Docs:** https://huggingface.co/docs/hub/spaces
- **Streamlit Docs:** https://docs.streamlit.io
- **Sportify AI GitHub:** https://github.com/vishnucharankolla2/sportify-ai
- **Sportify AI Documentation:** `/backend/docs/`

---

## Support

For deployment issues:
1. Check Hugging Face Space logs (⋮ menu → Logs)
2. Review Streamlit error messages in app
3. Check backend API logs
4. Open GitHub issue: https://github.com/vishnucharankolla2/sportify-ai/issues

---

**Last Updated:** February 2, 2026
**Version:** 1.0
**Status:** Ready for Deployment
