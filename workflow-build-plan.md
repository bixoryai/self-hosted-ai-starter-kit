# n8n AI Workflow Build Plan & Tracker

**Project:** Self-hosted AI Starter Kit  
**Last Updated:** August 18, 2026  
**Purpose:** Track all AI-powered n8n workflows - built, imported, and planned

**Environment this reflects:** n8n **2.36.0**, PostgreSQL **17**, Qdrant **v1.19.0**, Ollama on the Windows host (`host.docker.internal:11434`).

---

## 📊 **Current Status Overview**

| Category | Count | Status |
|----------|-------|--------|
| **Workflow JSON Files** | 10 | ✅ Created |
| **Workflows in n8n Database** | 12 | ✅ All files imported |
| **Active Workflows** | 4 | ▶️ Running |
| **Proposed New Workflows** | 8 | 📝 Planned |

---

## ✅ **EXISTING WORKFLOWS**

### **A. Workflows in the n8n Database**

Available in the n8n UI at http://localhost:5678:

| # | Workflow ID | Name | State |
|---|-------------|------|-------|
| 1 | `f3407nk2cSrvl0aa` | Interactive Social Posts with Topic Selection and Approval | ✅ Active |
| 2 | `R0Ipc1PSJAltE0h6` | Learn n8n Basics in 3 Easy Steps ✨ | ✅ Active |
| 3 | `8TcDFqurpB8Jzl70` | Simple Ollama Calendar Agent V1.0 | ✅ Active |
| 4 | `CgmNjq9AcICAPPyi` | Simple Ollama Chatbot | ✅ Active |
| 5 | `auto-export-monitor` | Auto-Export Workflow Monitor | ⬜ Inactive |
| 6 | `ygwGs7s8Q1o8Q2rr` | Chat with a database using AI | ⬜ Inactive |
| 7 | `rG2dxJR1HY5WNE4l` | Generate AI-Powered LinkedIn Posts with Google Gemini and Gen-Imager | ⬜ Inactive |
| 8 | `UbI2h5lXrIcJYyXS` | LinkedIn Post Automation with AI & Slack Approval | ⬜ Inactive |
| 9 | `QL2bUUsxQZjqBpVI` | Local Chatbot with Retrieval Augmented Generation (RAG) | ⬜ Inactive |
| 10 | `giq3zqaP4QbY6LgC` | Research_Paper_Scraper_to_Google_Sheets | ⬜ Inactive |
| 11 | `fB61UhBMRQ3kCrUE` | Self-Hosted Automate Social Media Posts with Local AI Content and Images across Twitter, LinkedIn & Facebook | ⬜ Inactive |
| 12 | `Pk4NQ2rND1t8LDzQ` | Simple OpenAI Chatbot Agent | ⬜ Inactive |

### **B. Workflow JSON Files**

All 10 files in `n8n/custom/workflows/` have been imported. Two of them
(`Interactive Social Posts…`, `Simple Ollama Calendar Agent - FINAL`) carry the
id of the live workflow they represent, so re-importing updates that workflow
rather than creating a duplicate.

`rag-chatbot-for-company-info.json` is **not** imported by choice: it uses
Pinecone, an external paid service, for a capability Qdrant already provides
locally. Port it to Qdrant before importing.

**Importing from the CLI:**

```bash
docker exec n8n n8n import:workflow --separate --input=/data/shared/<dir>/
```

⚠️ `import:workflow` **deactivates every workflow it touches**. Re-activate
afterwards and restart n8n, or the trigger silently stops firing:

```bash
docker exec n8n n8n publish:workflow --id=<workflow-id>
docker compose restart n8n
```

---

## ⚠️ **Known Gaps**

| Item | Detail |
|------|--------|
| **No workflow has been run end-to-end** | Everything verified so far is static (node types, model names, connectivity). The chat trigger is not a public webhook and `n8n execute` needs an Execute Workflow Trigger, so a real smoke test has to happen in the UI. |
| **Qdrant collections need re-indexing** | The RAG workflow's embedding model moved from `mxbai-embed-large` (1024 dims) to `nomic-embed-text-v2-moe` (768 dims). Collections built with the old model cannot be queried until rebuilt. |
| **Pinecone dependency** | `rag-chatbot-for-company-info.json` still targets Pinecone rather than the local Qdrant. |
| **Credentials not wired** | The LinkedIn / Twitter / Facebook / Slack / Gemini workflows import cleanly but need credentials before they run. |

**Ollama models referenced by workflows** — all verified present on the host:
`llama3.2:latest`, `gemma4:latest`, `mistral:7b`, `nomic-embed-text-v2-moe:latest`.
Check with `curl -s http://localhost:11434/api/tags` before adding a workflow that
names a new model; a missing model fails only at run time.

---

## 📝 **PROPOSED NEW WORKFLOWS TO BUILD**

### **Category 1: Communication & Email**

#### 1. ✅ AI Email Assistant 📧
- **Status:** ⬜ Not Started
- **Priority:** 🔴 High
- **Description:** Automated email management with AI
- **Features:**
  - Reads incoming emails (Gmail/Outlook)
  - Analyzes sentiment and urgency using AI
  - Auto-generates draft responses
  - Flags important emails
  - Categorizes emails by topic
- **Tech Stack:** Gmail Node + Ollama/OpenAI + Classification Node
- **Use Case:** Customer support, inbox management
- **Estimated Build Time:** 2-3 hours

---

### **Category 2: Content Creation & Marketing**

#### 2. ✅ Content Repurposing Agent 🔄
- **Status:** ⬜ Not Started
- **Priority:** 🔴 High
- **Description:** Turn one piece of content into multiple formats
- **Features:**
  - Input: One blog post/article
  - Generates: Twitter thread, LinkedIn post, Instagram caption, YouTube description
  - Platform-specific optimization
  - Hashtag generation
  - Tone adjustment per platform
- **Tech Stack:** Form Trigger + Ollama + Multiple Output Nodes
- **Use Case:** Content marketers, bloggers, social media managers
- **Estimated Build Time:** 3-4 hours

#### 3. ✅ AI News Curator 📰
- **Status:** ⬜ Not Started
- **Priority:** 🟡 Medium
- **Description:** Personalized daily news digest
- **Features:**
  - Monitors RSS feeds or news APIs
  - Filters by your interests using AI
  - Summarizes top stories
  - Sends daily digest via email/Slack
  - Removes duplicates and clickbait
- **Tech Stack:** RSS Node + Ollama + Summarization + Email Node
- **Use Case:** Staying informed without information overload
- **Estimated Build Time:** 2-3 hours

---

### **Category 3: Document Processing**

#### 4. ✅ Smart Document Analyzer 📄
- **Status:** ⬜ Not Started
- **Priority:** 🔴 High
- **Description:** Extract insights from any document
- **Features:**
  - Upload PDF, Word, Excel, etc.
  - Extracts key points and summaries
  - Creates action items automatically
  - Q&A interface for the document
  - Exports structured data
- **Tech Stack:** File Upload + PDF Parser + Ollama + Structured Output
- **Use Case:** Contract review, meeting notes, research papers
- **Estimated Build Time:** 3-4 hours

#### 5. ✅ Meeting Notes AI 🎤
- **Status:** ⬜ Not Started
- **Priority:** 🟡 Medium
- **Description:** Transform meeting transcripts into actionable summaries
- **Features:**
  - Processes meeting transcripts (manual or from tools)
  - Creates structured summaries
  - Lists action items with owners
  - Generates follow-up email drafts
  - Tracks decisions made
- **Tech Stack:** Webhook/Form + Text Processing + Ollama + Email Node
- **Use Case:** Team meetings, client calls, standups
- **Estimated Build Time:** 2-3 hours

---

### **Category 4: Research & Learning**

#### 6. ✅ AI Research Assistant 🔬
- **Status:** ⬜ Not Started
- **Priority:** 🟡 Medium
- **Description:** Automated research on any topic
- **Features:**
  - Given a topic, searches multiple sources
  - Web scraping for relevant content
  - Summarizes findings with AI
  - Cites all sources
  - Creates organized research reports (Markdown/PDF)
- **Tech Stack:** HTTP Request + Web Scraper + Ollama + File Writer
- **Use Case:** Market research, academic research, competitive analysis
- **Estimated Build Time:** 4-5 hours

---

### **Category 5: Customer Support**

#### 7. ✅ Customer Support Bot 💬
- **Status:** ⬜ Not Started
- **Priority:** 🔴 High
- **Description:** 24/7 intelligent customer support
- **Features:**
  - Answers FAQs using your knowledge base
  - Uses RAG (Retrieval Augmented Generation)
  - Escalates complex queries to humans
  - Learns from your company documents
  - Multi-channel (web, Slack, Discord, Telegram)
- **Tech Stack:** Chat Trigger + Qdrant + Ollama + Conditional Logic
- **Use Case:** Small business support, internal IT helpdesk
- **Estimated Build Time:** 4-5 hours

---

### **Category 6: Developer Tools**

#### 8. ✅ Code Documentation Generator 💻
- **Status:** ⬜ Not Started
- **Priority:** 🟢 Low
- **Description:** Auto-generate documentation from code
- **Features:**
  - Scans code repositories (GitHub/GitLab)
  - Generates human-readable documentation
  - Creates/updates README files
  - Explains complex functions
  - Suggests improvements
  - API documentation generation
- **Tech Stack:** GitHub Node + Code Parser + Ollama + Markdown Writer
- **Use Case:** Open source projects, internal tools
- **Estimated Build Time:** 5-6 hours

---

## 🎯 **BUILD PRIORITY QUEUE**

### **Phase 1: Import Existing Workflows (Week 1)**
- [ ] Import all 8 existing workflow JSON files into n8n
- [ ] Test each workflow for functionality
- [ ] Document any missing credentials or configurations
- [ ] Update this document with import status

### **Phase 2: High Priority Builds (Week 2-3)**
- [ ] 1. AI Email Assistant 📧
- [ ] 2. Content Repurposing Agent 🔄
- [ ] 3. Smart Document Analyzer 📄
- [ ] 4. Customer Support Bot 💬

### **Phase 3: Medium Priority Builds (Week 4-5)**
- [ ] 5. Meeting Notes AI 🎤
- [ ] 6. AI News Curator 📰
- [ ] 7. AI Research Assistant 🔬

### **Phase 4: Enhancement & Optimization (Week 6+)**
- [ ] 8. Code Documentation Generator 💻
- [ ] Test all workflows end-to-end
- [ ] Create video tutorials for each workflow
- [ ] Write detailed documentation

---

## 🔧 **TECHNICAL REQUIREMENTS**

### **Prerequisites**
- ✅ n8n running on localhost:5678
- ✅ Ollama with models downloaded (llama3.2)
- ✅ Qdrant vector store (localhost:6333)
- ✅ PostgreSQL database (localhost:5432)
- ⬜ Additional Ollama models needed:
  - `ollama pull llama3.2` (default, already installed)
  - `ollama pull codellama` (for code documentation)
  - `ollama pull mistral` (faster responses)

### **Additional Credentials Needed**
- ⬜ Twitter/X API (for social media workflows)
- ⬜ LinkedIn API (for LinkedIn posting)
- ⬜ Slack Webhook (for notifications)
- ⬜ GitHub Token (for code documentation)
- ⬜ RSS Feed URLs (for news curator)

---

## 📈 **SUCCESS METRICS**

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Total Workflows Built | 16+ | 3 | 🟡 19% |
| Workflows Imported | 11+ | 3 | 🔴 27% |
| Active Workflows | 8+ | 0 | 🔴 0% |
| Documentation Complete | 100% | 30% | 🟡 30% |

---

## 📚 **WORKFLOW TEMPLATES & REFERENCES**

### **Official n8n AI Templates**
- [n8n AI Template Gallery](https://n8n.io/workflows/categories/ai/)
- [RAG Chatbot Template](https://n8n.io/workflows/2165-chat-with-pdf-docs-using-ai-quoting-sources/)
- [AI Agent Examples](https://n8n.io/workflows/1954-ai-agent-chat/)

### **Learning Resources**
- [n8n AI Concepts](https://docs.n8n.io/advanced-ai/intro-tutorial/)
- [Langchain in n8n](https://docs.n8n.io/advanced-ai/langchain/langchain-n8n/)
- [Vector Databases Guide](https://docs.n8n.io/advanced-ai/examples/understand-vector-databases/)

---

## 🚀 **NEXT STEPS**

1. **Immediate Actions:**
   - [ ] Import existing 8 workflow JSON files
   - [ ] Test Ollama connection from n8n
   - [ ] Verify Qdrant is accessible
   - [ ] Download additional Ollama models if needed

2. **This Week:**
   - [ ] Choose first workflow to build from Phase 2
   - [ ] Set up any missing credentials
   - [ ] Create workflow skeleton

3. **This Month:**
   - [ ] Complete Phase 1 (imports)
   - [ ] Complete Phase 2 (high priority builds)
   - [ ] Document each workflow

---

## 📝 **NOTES & LEARNINGS**

### **Tips for Building n8n Workflows**
- Always test with small data first
- Use the "Execute Workflow" button to debug
- Save frequently
- Use clear node names
- Add sticky notes for documentation
- Version control: use the auto-export workflow

### **Common Issues & Solutions**
- **Ollama connection errors:** Check Base URL is `http://ollama:11434` in credentials
- **Large responses:** Use text splitting nodes
- **Rate limits:** Add delay nodes between API calls
- **Token limits:** Summarize before sending to LLM

---

## 🤝 **CONTRIBUTION GUIDELINES**

When adding new workflows:
1. Create workflow JSON file in `/n8n/custom/workflows/`
2. Update this document with workflow details
3. Add to appropriate category
4. Set priority level
5. Document required credentials
6. Include use cases and examples

---

**Document Version:** 1.0  
**Maintained By:** AI Coding Assistant  
**Repository:** [bixoryai/n8n-local](https://github.com/bixoryai/n8n-local) (fork of [n8n-io/self-hosted-ai-starter-kit](https://github.com/n8n-io/self-hosted-ai-starter-kit))

