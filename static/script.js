// CampusMate Interactive Client
let currentTab = 'chat';
let activeCategory = 'all';
let activeLocationCategory = 'all';

const CATEGORY_CHIPS = {
  all: [
    "Where is the Principal office and Exam section?",
    "Where is the CSE department and HOD cabin?",
    "How to reach Central Library and Digital Library?",
    "Attendance rules at GEC Hassan?",
    "How to apply for SSP Karnataka Scholarship?",
    "Passing criteria for VTU CIE and SEE?",
    "How to get KSRTC Student Bus Pass via Seva Sindhu?",
    "Where is the college canteen and hostels?"
  ],
  directions: [
    "Where is the Principal office and Chamber?",
    "Where is the Examination Section and Student Section?",
    "Where is the CSE Department and Programming Lab?",
    "Where is the ECE Department and Embedded Systems Lab?",
    "Where is the Central Library and Book Bank Section?",
    "Where is the College Canteen and Boys/Girls Hostels?",
    "Where is the Training & Placement Cell (TPC)?",
    "How to reach GEC Hassan from Hassan KSRTC Bus Stand?"
  ],
  first_year: [
    "What subjects are in Physics Cycle vs Chemistry Cycle?",
    "What scientific calculators are allowed in exams?",
    "How does branch change work after 1st year?",
    "What happens during mandatory Student Induction Program?"
  ],
  academics: [
    "What is the minimum attendance requirement at GEC Hassan?",
    "What is the passing criteria for CIE and SEE?",
    "What is the VTU vertical progression and backlog rule?",
    "How do I apply for revaluation and answer script photocopy?"
  ],
  scholarships: [
    "How to apply for SSP Post-Matric Scholarship?",
    "What documents are required for SSP Karnataka?",
    "What are the benefits under the SNQ fee quota?",
    "What central scholarships are on National Scholarship Portal?"
  ],
  transport: [
    "How do I apply for KSRTC student bus pass on Seva Sindhu?",
    "What are the college bus timings and routes in Hassan?",
    "What are the hostel room rent and mess fees?"
  ],
  placements: [
    "Which companies visit GEC Hassan for campus placements?",
    "What is the placement eligibility criteria and CGPA cutoff?",
    "What is the mandatory VTU internship requirement?"
  ],
  courses: [
    "What is the syllabus for Routing Algorithms in networks?",
    "What laboratories are in CSE, ECE and ME departments?",
    "What is the formula to convert VTU CGPA to percentage?"
  ]
};

// CAMPUS LOCATION DIRECTORY DATA
const CAMPUS_LOCATIONS = [
  {
    name: "Principal's Office & Chamber",
    category: "admin",
    block: "Administrative Block (Main Building)",
    floor: "Ground Floor",
    room: "Room 101",
    directions: "Enter through Main Gate 1, walk straight along the main central avenue (~80m) to the Administrative Portico. Turn immediate right inside the main lobby."
  },
  {
    name: "Examination Section & VTU Evaluation Centre",
    category: "admin",
    block: "Administrative Block",
    floor: "Ground Floor",
    room: "Room 105",
    directions: "From the Administrative foyer, proceed to the end of the right corridor past the student fee counter."
  },
  {
    name: "Student Administrative & Accounts Section",
    category: "admin",
    block: "Administrative Block",
    floor: "Ground Floor",
    room: "Room 103 & 106",
    directions: "Right corridor of the main building. Handles admission documentation, Bonafide/Study certificates, and fee challans."
  },
  {
    name: "Student Welfare Officer (SWO) Office",
    category: "admin",
    block: "Administrative Block",
    floor: "Ground Floor",
    room: "Room 108",
    directions: "Left corridor of the Administrative Block ground floor."
  },
  {
    name: "Training & Placement Cell (TPC)",
    category: "admin",
    block: "Administrative Block",
    floor: "First Floor",
    room: "Room 201",
    directions: "Take the central stairs in the main building to the 1st floor; turn right towards the interview and seminar suites."
  },
  {
    name: "Main College Auditorium & Seminar Hall",
    category: "admin",
    block: "Administrative Block",
    floor: "Second Floor",
    room: "Room 301 (Auditorium)",
    directions: "Take the main building stairs to the 2nd floor. Central double doors lead into the 450-seat acoustic auditorium."
  },
  {
    name: "Computer Science & Engineering (CSE) Department",
    category: "academic1",
    block: "Academic Block 1 (East Wing)",
    floor: "First Floor",
    room: "Room 210 (HOD Chamber)",
    directions: "Take the covered eastern walkway from Admin Block to Academic Block 1. Go up 1 flight of stairs to the 1st floor; HOD cabin and faculty rooms are on the left."
  },
  {
    name: "Advanced Programming & Data Structures Lab",
    category: "academic1",
    block: "Academic Block 1",
    floor: "First Floor",
    room: "Room 214",
    directions: "Located adjacent to the CSE Department faculty wing on the 1st floor."
  },
  {
    name: "AI, Machine Learning & Cloud Computing Lab",
    category: "academic1",
    block: "Academic Block 1",
    floor: "Second Floor",
    room: "Room 312",
    directions: "Second floor of Academic Block 1, north wing."
  },
  {
    name: "Electronics & Communication Engineering (ECE)",
    category: "academic1",
    block: "Academic Block 1",
    floor: "Ground Floor",
    room: "Room 112 (HOD Chamber)",
    directions: "Ground floor of Academic Block 1, immediate right past the east entrance foyer."
  },
  {
    name: "Microcontroller & Embedded Systems Lab",
    category: "academic1",
    block: "Academic Block 1",
    floor: "Ground Floor",
    room: "Room 118",
    directions: "Ground floor of Academic Block 1, corridor opposite the ECE HOD chamber."
  },
  {
    name: "Civil Engineering Department & Labs",
    category: "academic2",
    block: "Academic Block 2 (West Wing)",
    floor: "Ground Floor",
    room: "Room C-101 (HOD) & C-104 (Survey Lab)",
    directions: "Take the central western walkway from Admin Block to Academic Block 2 ground floor."
  },
  {
    name: "Basic Sciences & Humanities (Physics/Chem/Maths)",
    category: "academic2",
    block: "Academic Block 2",
    floor: "First Floor",
    room: "Rooms C-201, C-205 (Physics Lab), C-208 (Chemistry Lab)",
    directions: "First floor of Academic Block 2. First-year labs and faculty cabins are situated along the central gallery."
  },
  {
    name: "Mechanical Engineering Department & CADD Lab",
    category: "academic2",
    block: "Academic Block 2",
    floor: "Second Floor",
    room: "Room M-301 (HOD) & M-305 (CAD/CAM Lab)",
    directions: "Second floor of Academic Block 2, accessible via the west stairwell."
  },
  {
    name: "Central Library & Book Bank Section",
    category: "library",
    block: "Library Building (Central Quadrangle)",
    floor: "Ground Floor",
    room: "Circulation Desk & Stacks",
    directions: "Located centrally between Academic Block 1 and Academic Block 2. Enter through the main glass doors facing the central lawn."
  },
  {
    name: "Digital Library & VTU e-Learning Terminals",
    category: "library",
    block: "Library Building",
    floor: "First Floor",
    room: "Digital Resource Center",
    directions: "First floor of the Library Building with 40 high-speed multimedia terminals accessing IEEE Xplore."
  },
  {
    name: "College Canteen / Cafeteria",
    category: "amenities",
    block: "Canteen Complex",
    floor: "Ground Floor",
    room: "Dining Hall",
    directions: "Located along the paved pathway connecting the Academic Blocks to the Mechanical Workshops. Serves breakfast, meals, and tea/coffee."
  },
  {
    name: "Boys' Hostel",
    category: "amenities",
    block: "North-West Campus Sector",
    floor: "Multi-Storey Residential Blocks",
    room: "Warden Office at Entrance",
    directions: "Walk past Academic Block 2 towards the rear gate (approx. 200m). Features attached mess and volleyball ground."
  },
  {
    name: "Girls' Hostel",
    category: "amenities",
    block: "Eastern Campus Perimeter",
    floor: "Secure Residential Enclosure",
    room: "Security Checkpoint & Warden Desk",
    directions: "Located in a gated enclosure adjacent to staff quarters on the eastern boundary with 24/7 security."
  },
  {
    name: "Transit: From Hassan Central KSRTC Bus Stand",
    category: "transit",
    block: "B.M. Road Route (~4 km)",
    floor: "City Transit",
    room: "GEC Hassan Bus Stop",
    directions: "Board any town bus (Red Bus) towards B.M. Road / Shantigrama or take an auto-rickshaw (~10-12 mins) to GEC College gate. College buses depart the KSRTC stand at 8:30 AM and 8:45 AM daily."
  },
  {
    name: "Transit: From Hassan Junction Railway Station",
    category: "transit",
    block: "Station Road to B.M. Road (~5 km)",
    floor: "City Transit",
    room: "GEC Hassan Stop",
    directions: "Auto-rickshaws available 24/7 directly from station exit (~12 mins) directly to campus gate."
  },
  {
    name: "Faculty Board Room & Conference Hall",
    category: "admin",
    block: "Administrative Block",
    floor: "Ground Floor",
    room: "Room 110",
    directions: "Left wing of the Administrative Block ground floor, past the SWO office."
  },
  {
    name: "Central Server Room & Campus Network Centre",
    category: "admin",
    block: "Administrative Block",
    floor: "First Floor",
    room: "Room 204",
    directions: "First floor of the Administrative Block, adjacent to the TPC corridor."
  },
  {
    name: "Visitor's Waiting Lounge & Helpdesk",
    category: "admin",
    block: "Administrative Block",
    floor: "Ground Floor",
    room: "Main Lobby",
    directions: "Right inside the main portico entrance lobby; first point of contact for visitors."
  },
  {
    name: "Analog & Digital Electronics Laboratory",
    category: "academic1",
    block: "Academic Block 1",
    floor: "Ground Floor",
    room: "Room 115",
    directions: "Ground floor of Academic Block 1, opposite the ECE HOD chamber."
  },
  {
    name: "DBMS & Web Technology Laboratory",
    category: "academic1",
    block: "Academic Block 1",
    floor: "First Floor",
    room: "Room 216",
    directions: "First floor of Academic Block 1, next to the CSE faculty wing."
  },
  {
    name: "Computer Networks & IoT Research Lab",
    category: "academic1",
    block: "Academic Block 1",
    floor: "Second Floor",
    room: "Room 315",
    directions: "Second floor of Academic Block 1, north wing."
  },
  {
    name: "Department of Basic Sciences & Humanities",
    category: "academic2",
    block: "Academic Block 2",
    floor: "First Floor",
    room: "Room C-201",
    directions: "First floor of Academic Block 2, accessible via the west stairwell."
  },
  {
    name: "Engineering Physics Laboratory",
    category: "academic2",
    block: "Academic Block 2",
    floor: "First Floor",
    room: "Room C-205",
    directions: "First floor of Academic Block 2, adjacent to Basic Sciences department."
  },
  {
    name: "Engineering Chemistry Laboratory",
    category: "academic2",
    block: "Academic Block 2",
    floor: "First Floor",
    room: "Room C-208",
    directions: "First floor of Academic Block 2, next to the Physics lab."
  },
  {
    name: "Language & Communication Skills Lab",
    category: "academic2",
    block: "Academic Block 2",
    floor: "First Floor",
    room: "Room C-212",
    directions: "First floor of Academic Block 2, near the Civil department stairwell."
  },
  {
    name: "Surveying Laboratory & Equipment Store",
    category: "academic2",
    block: "Academic Block 2",
    floor: "Ground Floor",
    room: "Room C-104",
    directions: "Ground floor of Academic Block 2, Civil Engineering wing."
  },
  {
    name: "Concrete & Highway Materials Testing Lab",
    category: "academic2",
    block: "Academic Block 2",
    floor: "Ground Floor",
    room: "Room C-108",
    directions: "Ground floor of Academic Block 2, adjacent to the Surveying lab."
  },
  {
    name: "CADD / CAM Laboratory",
    category: "academic2",
    block: "Academic Block 2",
    floor: "Second Floor",
    room: "Room M-305",
    directions: "Second floor of Academic Block 2, Mechanical Engineering wing."
  },
  {
    name: "Mechanical Workshop Complex",
    category: "amenities",
    block: "Rear Campus (Behind Academic Block 2)",
    floor: "Ground Level",
    room: "Workshop Sheds 1 & 2",
    directions: "Walk past Academic Block 2 towards the rear gate; machine shop, foundry and forging sheds."
  },
  {
    name: "Sports Complex & Playground",
    category: "amenities",
    block: "Behind Library Block",
    floor: "Open Ground",
    room: "Cricket/Football Ground, Gymnasium",
    directions: "Located behind the Central Library; full-size cricket/football ground, volleyball court and indoor gym."
  },
  {
    name: "Girls' Common Room",
    category: "amenities",
    block: "Academic Block 1",
    floor: "Ground Floor",
    room: "Room 102",
    directions: "Ground floor of Academic Block 1 with restroom and first-aid facilities."
  },
  {
    name: "Boys' Common Room",
    category: "amenities",
    block: "Academic Block 2",
    floor: "Ground Floor",
    room: "Room C-102",
    directions: "Ground floor of Academic Block 2 with restroom facilities."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderChips('all');
  renderLocations();
  populateGmapsDestinations();
  loadAdminStats();
  loadDocumentsList();
});

// Tab Switching
function switchTab(tab) {
  currentTab = tab;
  const sections = {
    chat: document.getElementById('chatSection'),
    directions: document.getElementById('directionsSection'),
    calc: document.getElementById('calcSection'),
    admin: document.getElementById('adminSection')
  };
  const buttons = {
    chat: document.getElementById('tabChatBtn'),
    directions: document.getElementById('tabDirectionsBtn'),
    calc: document.getElementById('tabCalcBtn'),
    admin: document.getElementById('tabAdminBtn')
  };

  Object.keys(sections).forEach(k => {
    if (sections[k]) sections[k].classList.remove('active');
    if (buttons[k]) buttons[k].classList.remove('active');
  });

  if (sections[tab]) sections[tab].classList.add('active');
  if (buttons[tab]) buttons[tab].classList.add('active');

  if (tab === 'directions') {
    renderLocations();
  } else if (tab === 'admin') {
    loadAdminStats();
    loadDocumentsList();
  }
}

// Category Chips Filtering
function filterChips(category) {
  activeCategory = category;
  document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
  const activeBtn = event.currentTarget || document.querySelector(`.cat-pill[onclick*="'${category}'"]`);
  if (activeBtn) activeBtn.classList.add('active');
  renderChips(category);
}

function renderChips(category) {
  const container = document.getElementById('quickChips');
  container.innerHTML = '';
  const list = CATEGORY_CHIPS[category] || CATEGORY_CHIPS['all'];

  list.forEach(q => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = q;
    chip.onclick = () => {
      const input = document.getElementById('userInput');
      input.value = q;
      input.focus();
      document.getElementById('chatForm').dispatchEvent(new Event('submit', { cancelable: true }));
    };
    container.appendChild(chip);
  });
}

// CAMPUS LOCATIONS DIRECTORY
function filterLocationCategory(cat) {
  activeLocationCategory = cat;
  document.querySelectorAll('.l-pill').forEach(btn => btn.classList.remove('active'));
  const activeBtn = event.currentTarget || document.querySelector(`.l-pill[onclick*="'${cat}'"]`);
  if (activeBtn) activeBtn.classList.add('active');
  renderLocations();
}

function filterLocations() {
  renderLocations();
}

function renderLocations() {
  const grid = document.getElementById('locationsGrid');
  if (!grid) return;
  const search = (document.getElementById('locationSearchInput')?.value || '').toLowerCase().trim();

  let filtered = CAMPUS_LOCATIONS.filter(item => {
    const matchCat = (activeLocationCategory === 'all' || item.category === activeLocationCategory);
    const matchSearch = !search || 
      item.name.toLowerCase().includes(search) || 
      item.block.toLowerCase().includes(search) || 
      item.directions.toLowerCase().includes(search) || 
      item.room.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="text-center text-muted" style="grid-column: 1/-1; padding: 30px;">No campus locations match your search. Try searching for "Principal", "Exam", "CSE", "Library", or "Hostel".</div>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'location-card';
    card.innerHTML = `
      <div class="loc-card-top">
        <span class="loc-badge ${item.category}">${item.category}</span>
        <span class="loc-floor">📍 ${item.floor}</span>
      </div>
      <div class="loc-name">${escapeHtml(item.name)}</div>
      <div class="loc-meta">
        <div><strong>Block:</strong> ${escapeHtml(item.block)}</div>
        <div><strong>Room / Wing:</strong> <code>${escapeHtml(item.room)}</code></div>
      </div>
      <div class="loc-directions-box">
        <strong>Walking Directions:</strong><br>${escapeHtml(item.directions)}
      </div>
      <button class="loc-btn-ask" onclick="askLocationInChat('${escapeHtml(item.name)}')">
        💬 Ask AI Assistant about this location &rarr;
      </button>
    `;
    grid.appendChild(card);
  });
}

function askLocationInChat(locName) {
  switchTab('chat');
  const input = document.getElementById('userInput');
  input.value = `Where is ${locName} and how do I reach it?`;
  document.getElementById('chatForm').dispatchEvent(new Event('submit', { cancelable: true }));
}

// Chat Handling
function handleKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.getElementById('chatForm').dispatchEvent(new Event('submit', { cancelable: true }));
  }
}

async function handleSendMessage(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;

  // Add user message
  appendUserMessage(text);
  input.value = '';
  input.style.height = 'auto';

  // Add bot loading message
  const loadingId = appendLoadingMessage();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: text, top_k: 4 })
    });

    const data = await response.json();
    removeMessage(loadingId);

    appendBotMessage(data.answer, data.sources, data.confidence, data.grounded);
  } catch (error) {
    removeMessage(loadingId);
    appendBotMessage("An error occurred while connecting to the CampusMate RAG backend. Please try again.", [], 0, false);
    console.error(error);
  }
}

function appendUserMessage(text) {
  const container = document.getElementById('chatContainer');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message user-message';
  msgDiv.innerHTML = `
    <div class="avatar user-avatar">YOU</div>
    <div class="message-content">
      <div class="message-header">
        <strong>Student</strong>
        <span class="time-label">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="message-body">
        <p>${escapeHtml(text)}</p>
      </div>
    </div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function appendLoadingMessage() {
  const container = document.getElementById('chatContainer');
  const msgDiv = document.createElement('div');
  const id = 'loading_' + Date.now();
  msgDiv.id = id;
  msgDiv.className = 'message bot-message';
  msgDiv.innerHTML = `
    <div class="avatar bot-avatar">CM</div>
    <div class="message-content">
      <div class="message-header">
        <strong>CampusMate Assistant</strong>
        <span class="time-label">Retrieving verified facts...</span>
      </div>
      <div class="message-body">
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    </div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function appendBotMessage(answer, sources, confidence, grounded) {
  const container = document.getElementById('chatContainer');
  const msgDiv = document.createElement('div');
  const msgId = 'botmsg_' + Date.now();
  msgDiv.id = msgId;
  msgDiv.className = 'message bot-message';

  let renderedHtml = "";
  if (window.marked) {
    renderedHtml = marked.parse(answer);
  } else {
    renderedHtml = `<p>${escapeHtml(answer).replace(/\n/g, '<br>')}</p>`;
  }

  // Citations accordion if sources exist
  let citationsHtml = '';
  if (sources && sources.length > 0) {
    const listId = 'cit_' + Date.now();
    citationsHtml = `
      <div class="citations-wrapper">
        <div class="citations-toggle" onclick="toggleCitations('${listId}')">
          <span>📚 Verified Institutional Sources (${sources.length} passages &bull; ${confidence}% Match)</span>
          <span>&#9662;</span>
        </div>
        <div class="citations-list" id="${listId}">
          ${sources.map((s, idx) => `
            <div class="citation-item">
              <div class="citation-item-header">
                <span>[#${idx+1}] ${escapeHtml(s.source)}</span>
                <span>${s.similarity}% relevance</span>
              </div>
              <div class="citation-item-text">${escapeHtml(s.text.trim())}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  msgDiv.innerHTML = `
    <div class="avatar bot-avatar">CM</div>
    <div class="message-content">
      <div class="message-header">
        <strong>CampusMate Assistant</strong>
        <div class="msg-actions">
          <button class="btn-msg-action" onclick="copyResponseText('${msgId}')" title="Copy answer">
            📋 Copy
          </button>
          <button class="btn-msg-action" onclick="speakResponseText('${msgId}')" title="Listen to answer">
            🔊 Listen
          </button>
          <span class="time-label">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      <div class="message-body" id="body_${msgId}">
        ${renderedHtml}
        ${citationsHtml}
      </div>
    </div>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function toggleCitations(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.toggle('show');
  }
}

function copyResponseText(msgId) {
  const body = document.getElementById('body_' + msgId);
  if (!body) return;
  const text = body.innerText.replace(/📚 Verified Institutional Sources[\s\S]*/, '').trim();
  navigator.clipboard.writeText(text).then(() => {
    alert("Answer copied to clipboard!");
  }).catch(err => {
    console.error("Copy failed", err);
  });
}

function speakResponseText(msgId) {
  if (!('speechSynthesis' in window)) {
    alert("Text-to-speech is not supported by your browser.");
    return;
  }
  const body = document.getElementById('body_' + msgId);
  if (!body) return;
  const text = body.innerText.replace(/📚 Verified Institutional Sources[\s\S]*/, '').trim();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.onstart = () => {
    const input = document.getElementById('userInput');
    input.placeholder = "Listening... speak now...";
  };
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    const input = document.getElementById('userInput');
    input.value = text;
    input.placeholder = "Ask where a department or office is, or ask about attendance, bus pass...";
    document.getElementById('chatForm').dispatchEvent(new Event('submit', { cancelable: true }));
  };
  recognition.onerror = () => {
    const input = document.getElementById('userInput');
    input.placeholder = "Ask where a department or office is, or ask about attendance, bus pass...";
  };
  recognition.start();
}

function clearChat() {
  const container = document.getElementById('chatContainer');
  container.innerHTML = `
    <div class="message bot-message">
      <div class="avatar bot-avatar">CM</div>
      <div class="message-content">
        <div class="message-header">
          <strong>CampusMate Assistant</strong>
          <span class="time-label">Just now</span>
        </div>
        <div class="message-body">
          <p>Chat cleared. Ask any question about GEC Hassan!</p>
        </div>
      </div>
    </div>
  `;
}

// VTU CALCULATOR FUNCTIONS
function calculatePassing() {
  const cieVal = parseFloat(document.getElementById('cieInput').value);
  const resultBox = document.getElementById('passResult');

  if (isNaN(cieVal) || cieVal < 0 || cieVal > 50) {
    resultBox.className = "result-box";
    resultBox.innerHTML = '<div class="result-title">Please enter a valid CIE score between 0 and 50.</div>';
    return;
  }

  if (cieVal < 20) {
    resultBox.className = "result-box fail";
    resultBox.innerHTML = `
      <div class="result-title">❌ Detention Alert: Not Eligible for SEE</div>
      <p>Under VTU regulations, you must secure at least <strong>20 out of 50 (40%)</strong> in Continuous Internal Evaluation (CIE).</p>
      <p>With <strong>${cieVal} / 50</strong>, you do not meet the minimum CIE threshold and cannot appear for the Semester End Examination in this course.</p>
    `;
    return;
  }

  const requiredTotalShortfall = 40 - cieVal;
  const minSeeScaled = Math.max(18, requiredTotalShortfall);
  const minSeeWritten = Math.ceil(minSeeScaled * 2);

  resultBox.className = "result-box pass";
  resultBox.innerHTML = `
    <div class="result-title">✅ Eligible for SEE Exam!</div>
    <p>• Minimum Marks needed in SEE: <strong>${minSeeScaled} / 50</strong></p>
    <p>• Written Exam Score needed: <strong>${minSeeWritten} / 100</strong></p>
    <p>• Total Predicted Aggregate: <strong>${cieVal + minSeeScaled} / 100 (Pass)</strong></p>
    <small class="text-muted">Formula: SEE &ge; 18/50 AND (CIE + SEE) &ge; 40/100.</small>
  `;
}

function calculatePercentage() {
  const cgpa = parseFloat(document.getElementById('cgpaInput').value);
  const resultBox = document.getElementById('cgpaResult');

  if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
    resultBox.className = "result-box";
    resultBox.innerHTML = '<div class="result-title">Please enter a valid CGPA between 0 and 10.</div>';
    return;
  }

  let percentage = 0;
  if (cgpa >= 0.75) {
    percentage = (cgpa - 0.75) * 10;
  }
  percentage = Math.round(percentage * 100) / 100;

  let classification = "Pass Class";
  if (cgpa >= 7.75) classification = "First Class with Distinction (FCD)";
  else if (cgpa >= 6.75) classification = "First Class (FC)";
  else if (cgpa >= 5.75) classification = "Second Class (SC)";

  resultBox.className = "result-box pass";
  resultBox.innerHTML = `
    <div class="result-title">🎯 Result: ${percentage}%</div>
    <p>• Class: <strong>${classification}</strong></p>
    <p>• Calculation: <code>(${cgpa} - 0.75) &times; 10 = ${percentage}%</code></p>
  `;
}

// ADMIN DASHBOARD
async function loadAdminStats() {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    document.getElementById('statDocs').textContent = data.total_documents || 0;
    document.getElementById('statChunks').textContent = data.total_vector_chunks || 0;
    document.getElementById('statModel').textContent = data.embedding_model || 'all-MiniLM-L6-v2';
    document.getElementById('statStore').textContent = data.vector_store || 'ChromaDB';
  } catch (err) {
    console.error("Failed to load stats", err);
  }
}

async function loadDocumentsList() {
  const tbody = document.getElementById('documentsTableBody');
  try {
    const res = await fetch('/api/documents');
    const data = await res.json();
    tbody.innerHTML = '';

    if (!data.documents || data.documents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No documents uploaded yet.</td></tr>`;
      return;
    }

    data.documents.forEach(doc => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(doc.name)}</strong></td>
        <td><span class="file-type-badge ${doc.type}">${doc.type}</span></td>
        <td>${doc.size_kb} KB</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Error loading documents.</td></tr>`;
  }
}

function updateFileNameDisplay() {
  const fileInput = document.getElementById('fileInput');
  const label = document.getElementById('selectedFileName');
  if (fileInput.files.length > 0) {
    label.textContent = `Selected: ${fileInput.files[0].name} (${Math.round(fileInput.files[0].size / 1024)} KB)`;
  } else {
    label.textContent = '';
  }
}

async function handleFileUpload(e) {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  if (fileInput.files.length === 0) {
    alert("Please select a file to upload (.pdf, .md, .txt)");
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  const uploadBtn = document.getElementById('uploadBtn');
  const originalText = uploadBtn.textContent;
  uploadBtn.disabled = true;
  uploadBtn.textContent = "Uploading & Indexing...";

  try {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();

    if (res.ok) {
      alert("Document uploaded and knowledge base updated successfully!");
      fileInput.value = '';
      document.getElementById('selectedFileName').textContent = '';
      loadAdminStats();
      loadDocumentsList();
    } else {
      alert("Upload failed: " + (result.detail || "Server error"));
    }
  } catch (err) {
    alert("Upload error: " + err.message);
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = originalText;
  }
}

async function rebuildIndex() {
  const btn = document.getElementById('rebuildBtn');
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = "Re-indexing Vectors...";

  try {
    const res = await fetch('/api/admin/rebuild-index', { method: 'POST' });
    const data = await res.json();
    alert(`Re-indexing completed! Processed ${data.total_files} files and created ${data.total_chunks} vector chunks.`);
    loadAdminStats();
    loadDocumentsList();
  } catch (err) {
    alert("Re-indexing error: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

async function openGoogleMapsDirections() {
  const origin = document.getElementById('gmapsOrigin').value.trim();
  const mode = document.getElementById('gmapsMode').value;
  const destination = document.getElementById('gmapsDestination').value;
  const resultBox = document.getElementById('gmapsResult');
  resultBox.textContent = 'Building directions link...';
  try {
    const params = new URLSearchParams({ origin, destination, mode });
    const res = await fetch('/api/directions?' + params.toString());
    const data = await res.json();
    if (data.maps_url) {
      resultBox.innerHTML = `Distance/Time: ${data.distance || '-'} / ${data.duration || '-'}<br><a href="${data.maps_url}" target="_blank" rel="noopener">Open turn-by-turn directions in Google Maps ↗</a>`;
      window.open(data.maps_url, '_blank', 'noopener');
    } else {
      resultBox.textContent = 'Could not build directions link.';
    }
  } catch (err) {
    resultBox.textContent = 'Error: ' + err.message;
  }
}

function useMyLocation() {
  const input = document.getElementById('gmapsOrigin');
  const resultBox = document.getElementById('gmapsResult');
  if (!navigator.geolocation) {
    resultBox.textContent = 'Geolocation is not supported by your browser.';
    return;
  }
  resultBox.textContent = 'Getting your location...';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      input.value = `${pos.coords.latitude},${pos.coords.longitude}`;
      resultBox.textContent = 'Location captured. Click "Open in Google Maps".';
    },
    (err) => {
      resultBox.textContent = 'Could not get location: ' + err.message;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}


function populateGmapsDestinations() {
  const select = document.getElementById('gmapsDestination');
  if (!select || typeof CAMPUS_LOCATIONS === 'undefined') return;
  // keep the default first option
  CAMPUS_LOCATIONS.forEach(item => {
    const opt = document.createElement('option');
    opt.value = `${item.name}, Government Engineering College Hassan, Hassan, Karnataka, India`;
    opt.textContent = `${item.name} — ${item.block} (${item.room})`;
    select.appendChild(opt);
  });
}


function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
