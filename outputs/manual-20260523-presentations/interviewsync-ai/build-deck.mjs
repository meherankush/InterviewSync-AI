import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pptxgen = require("C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/pptxgenjs@4.0.1/node_modules/pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "InterviewSync AI";
pptx.subject = "AI-powered real-time coding interview platform";
pptx.title = "InterviewSync AI Project Presentation";
pptx.company = "InterviewSync AI";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US",
};
pptx.defineLayout({ name: "CUSTOM_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "CUSTOM_WIDE";
pptx.margin = 0;

const C = {
  ink: "08111F",
  panel: "101B2F",
  paper: "F7FAFC",
  muted: "6B7A90",
  blue: "4F46E5",
  cyan: "06B6D4",
  green: "10B981",
  amber: "F59E0B",
  rose: "F43F5E",
  line: "D8E0EA",
  white: "FFFFFF",
};

function addBg(slide, dark = false) {
  slide.background = { color: dark ? C.ink : C.paper };
  if (dark) {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.ink }, line: { color: C.ink } });
    slide.addShape(pptx.ShapeType.arc, { x: 8.9, y: -1.2, w: 4.9, h: 4.9, line: { color: C.blue, transparency: 75, width: 2 }, adjustPoint: 0.35 });
    slide.addShape(pptx.ShapeType.arc, { x: -1.4, y: 4.6, w: 4, h: 4, line: { color: C.cyan, transparency: 82, width: 2 }, adjustPoint: 0.3 });
  } else {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.paper }, line: { color: C.paper } });
    slide.addShape(pptx.ShapeType.arc, { x: 9.6, y: -1, w: 4.5, h: 4.5, line: { color: C.blue, transparency: 82, width: 2 }, adjustPoint: 0.4 });
  }
}

function kicker(slide, text, x, y, dark = false) {
  slide.addShape(pptx.ShapeType.rect, { x, y: y + 0.05, w: 0.24, h: 0.05, fill: { color: dark ? C.cyan : C.blue }, line: { color: dark ? C.cyan : C.blue } });
  slide.addText(text.toUpperCase(), { x: x + 0.34, y, w: 4, h: 0.18, fontFace: "Aptos", fontSize: 8.5, bold: true, color: dark ? "9BE7F5" : C.blue, charSpace: 2 });
}

function title(slide, text, x, y, w, dark = false, size = 30) {
  slide.addText(text, { x, y, w, h: 0.9, fontFace: "Aptos Display", fontSize: size, bold: true, color: dark ? C.white : C.ink, margin: 0.02, breakLine: false, fit: "shrink" });
}

function body(slide, text, x, y, w, h, dark = false, size = 12) {
  slide.addText(text, { x, y, w, h, fontFace: "Aptos", fontSize: size, color: dark ? "C9D5E6" : C.muted, margin: 0.03, breakLine: false, fit: "shrink", valign: "mid" });
}

function pill(slide, text, x, y, w, color = C.blue) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 0.38, rectRadius: 0.08, fill: { color, transparency: 5 }, line: { color, transparency: 5 } });
  slide.addText(text, { x: x + 0.14, y: y + 0.095, w: w - 0.28, h: 0.16, fontSize: 8.5, bold: true, color: C.white, charSpace: 1.1, margin: 0 });
}

function footer(slide, n, dark = false) {
  slide.addText(`InterviewSync AI  /  ${String(n).padStart(2, "0")}`, { x: 0.55, y: 7.08, w: 2.4, h: 0.15, fontSize: 7.5, color: dark ? "6B7A90" : "94A3B8", charSpace: 0.8, margin: 0 });
}

function metric(slide, value, label, x, y, color) {
  slide.addText(value, { x, y, w: 1.55, h: 0.45, fontSize: 24, bold: true, color, margin: 0 });
  slide.addText(label, { x, y: y + 0.48, w: 1.85, h: 0.35, fontSize: 8.5, bold: true, color: "8CA0BA", charSpace: 0.8, margin: 0 });
}

function card(slide, x, y, w, h, heading, copy, color = C.blue) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: C.white }, line: { color: C.line, transparency: 10, width: 1 } });
  slide.addShape(pptx.ShapeType.rect, { x, y, w: 0.08, h, fill: { color }, line: { color } });
  slide.addText(heading, { x: x + 0.25, y: y + 0.25, w: w - 0.45, h: 0.28, fontSize: 13, bold: true, color: C.ink, margin: 0 });
  slide.addText(copy, { x: x + 0.25, y: y + 0.7, w: w - 0.45, h: h - 0.85, fontSize: 9.8, color: C.muted, fit: "shrink", breakLine: false, margin: 0.02 });
}

function slide1() {
  const s = pptx.addSlide(); addBg(s, true);
  kicker(s, "Project Presentation", 0.7, 0.62, true);
  s.addText("InterviewSync AI", { x: 0.7, y: 1.45, w: 7.1, h: 0.75, fontSize: 43, bold: true, color: C.white, margin: 0 });
  s.addText("AI-Powered Real-Time Collaborative Coding Interview Platform", { x: 0.72, y: 2.28, w: 7.3, h: 0.52, fontSize: 20, color: "DDE7F7", margin: 0 });
  body(s, "A full-stack platform combining AI interviewing, live code collaboration, code execution, camera-enabled sessions, proctoring, and analytics.", 0.72, 3.15, 6.2, 0.9, true, 13);
  pill(s, "React", 0.72, 4.55, 0.85, C.blue); pill(s, "Node.js", 1.75, 4.55, 1.05, C.cyan); pill(s, "Socket.IO", 2.98, 4.55, 1.25, C.green); pill(s, "Gemini", 4.42, 4.55, 1.05, C.amber); pill(s, "Judge0", 5.66, 4.55, 1.05, C.rose);
  s.addShape(pptx.ShapeType.roundRect, { x: 8.35, y: 1.14, w: 3.9, h: 4.75, rectRadius: 0.12, fill: { color: "0F1D33" }, line: { color: "2B3A55", width: 1 } });
  s.addShape(pptx.ShapeType.rect, { x: 8.62, y: 1.55, w: 3.36, h: 0.42, fill: { color: "1E293B" }, line: { color: "1E293B" } });
  ["function twoSum(nums, target) {", "  const seen = new Map();", "  for (let i = 0; i < nums.length; i++) {", "    if (seen.has(target - nums[i])) return true;", "  }", "}"].forEach((t, i) => {
    s.addText(t, { x: 8.65, y: 2.25 + i * 0.38, w: 3.2, h: 0.2, fontFace: "Consolas", fontSize: 9.5, color: i === 0 ? "A5B4FC" : "D7E1F0", margin: 0 });
  });
  footer(s, 1, true);
}

function slide2() {
  const s = pptx.addSlide(); addBg(s);
  kicker(s, "Problem", 0.68, 0.58);
  title(s, "Interview prep is fragmented: practice, coding, proctoring, and feedback live in separate tools.", 0.68, 1.0, 10.8, false, 27);
  body(s, "Candidates need one realistic environment that combines interview pressure, live collaboration, code execution, and actionable AI feedback.", 0.72, 1.95, 8.7, 0.45);
  card(s, 0.75, 3.0, 2.7, 1.75, "Low realism", "Mock interviews often miss camera pressure, interruptions, time limits, and interviewer-style follow-ups.", C.rose);
  card(s, 3.75, 3.0, 2.7, 1.75, "Weak coding workflow", "Separate editors make it hard to simulate collaborative coding rounds and review execution results.", C.amber);
  card(s, 6.75, 3.0, 2.7, 1.75, "Delayed feedback", "Candidates do not receive structured scoring across technical depth, clarity, and behavior.", C.blue);
  card(s, 9.75, 3.0, 2.7, 1.75, "No progress loop", "Practice history is rarely connected to a dashboard that shows improvement over time.", C.green);
  footer(s, 2);
}

function slide3() {
  const s = pptx.addSlide(); addBg(s, true);
  kicker(s, "Solution", 0.7, 0.58, true);
  title(s, "A single interview workspace connects AI, camera, collaboration, execution, and analytics.", 0.7, 1.0, 10.2, true, 28);
  const nodes = [
    ["AI Interviewer", "Gemini asks and evaluates", 0.75, 3.0, C.blue],
    ["Camera Room", "Participant + interviewer tiles", 3.35, 3.0, C.cyan],
    ["Code Room", "Socket.IO live sync", 5.95, 3.0, C.green],
    ["Run Code", "Judge0 execution", 8.55, 3.0, C.amber],
    ["Analytics", "Scores, alerts, history", 11.15, 3.0, C.rose],
  ];
  nodes.forEach(([h, c, x, y, col], i) => {
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 1.75, h: 1.38, rectRadius: 0.08, fill: { color: "111D33" }, line: { color: col, transparency: 10 } });
    s.addText(h, { x: x + 0.15, y: y + 0.25, w: 1.45, h: 0.25, fontSize: 11, bold: true, color: C.white, margin: 0 });
    s.addText(c, { x: x + 0.15, y: y + 0.65, w: 1.42, h: 0.42, fontSize: 8.2, color: "9FB2CC", fit: "shrink", margin: 0 });
    if (i < nodes.length - 1) s.addShape(pptx.ShapeType.chevron, { x: x + 1.92, y: y + 0.54, w: 0.35, h: 0.22, fill: { color: "334155" }, line: { color: "334155" } });
  });
  body(s, "The product flow mirrors a real interview: start session, enable camera, answer AI prompts, collaborate in code, execute submissions, and review results.", 0.75, 5.35, 9.5, 0.55, true);
  footer(s, 3, true);
}

function slide4() {
  const s = pptx.addSlide(); addBg(s);
  kicker(s, "Architecture", 0.68, 0.58);
  title(s, "The platform separates user experience, interview intelligence, collaboration, and persistence.", 0.68, 1.0, 10.3, false, 27);
  const boxes = [
    ["React + Vite", "Dashboard, interview room, code room, analytics", 0.8, 2.5, C.blue],
    ["Express API", "Auth, sessions, AI chat, run-code endpoint", 3.75, 2.5, C.cyan],
    ["Socket.IO", "Real-time code sync, room presence, language state", 6.7, 2.5, C.green],
    ["MongoDB", "Users, sessions, questions, answers, alerts", 9.65, 2.5, C.amber],
  ];
  boxes.forEach(([h, c, x, y, col]) => {
    card(s, x, y, 2.35, 1.55, h, c, col);
  });
  s.addShape(pptx.ShapeType.line, { x: 3.15, y: 3.28, w: 0.45, h: 0, line: { color: "94A3B8", width: 1.2, beginArrowType: "none", endArrowType: "triangle" } });
  s.addShape(pptx.ShapeType.line, { x: 6.1, y: 3.28, w: 0.45, h: 0, line: { color: "94A3B8", width: 1.2, endArrowType: "triangle" } });
  s.addShape(pptx.ShapeType.line, { x: 9.05, y: 3.28, w: 0.45, h: 0, line: { color: "94A3B8", width: 1.2, endArrowType: "triangle" } });
  s.addText("External services", { x: 0.85, y: 5.2, w: 2.1, h: 0.2, fontSize: 10, bold: true, color: C.ink, charSpace: 0.8, margin: 0 });
  pill(s, "Gemini API", 2.65, 5.1, 1.3, C.blue); pill(s, "Judge0 API", 4.15, 5.1, 1.35, C.green); pill(s, "Web Speech API", 5.7, 5.1, 1.75, C.amber); pill(s, "MediaDevices", 7.65, 5.1, 1.55, C.rose);
  footer(s, 4);
}

function slide5() {
  const s = pptx.addSlide(); addBg(s, true);
  kicker(s, "Real-Time Collaboration", 0.7, 0.58, true);
  title(s, "Socket.IO turns the code room into a shared interview workspace.", 0.7, 1.0, 9.5, true, 29);
  const rows = [
    ["Room access", "Join with room ID and password, public or authenticated route"],
    ["Live sync", "Every code change broadcasts to other participants in the same room"],
    ["Shared language", "Language selector state is synchronized across clients"],
    ["Presence", "Participant list updates on join, leave, and disconnect"],
  ];
  rows.forEach(([h, c], i) => {
    const y = 2.5 + i * 0.78;
    s.addShape(pptx.ShapeType.rect, { x: 0.82, y: y + 0.08, w: 0.12, h: 0.12, fill: { color: [C.blue, C.cyan, C.green, C.amber][i] }, line: { color: [C.blue, C.cyan, C.green, C.amber][i] } });
    s.addText(h, { x: 1.15, y, w: 2.1, h: 0.25, fontSize: 12, bold: true, color: C.white, margin: 0 });
    s.addText(c, { x: 3.15, y, w: 6.2, h: 0.25, fontSize: 10.5, color: "B7C7DA", margin: 0 });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 9.65, y: 2.15, w: 2.65, h: 3.0, rectRadius: 0.08, fill: { color: "111D33" }, line: { color: "263650" } });
  metric(s, "2", "users in same room", 10.0, 2.65, C.cyan); metric(s, "<1s", "edit propagation target", 10.0, 3.72, C.green);
  footer(s, 5, true);
}

function slide6() {
  const s = pptx.addSlide(); addBg(s);
  kicker(s, "AI Interviewer", 0.68, 0.58);
  title(s, "Gemini drives the interview loop from question to feedback.", 0.68, 1.0, 9.8, false, 29);
  const steps = [
    ["01", "Ask", "Domain-specific prompt starts the interview."],
    ["02", "Listen", "Speech-to-text or typed response captures the answer."],
    ["03", "Evaluate", "Scores technical depth, clarity, behavior, and confidence."],
    ["04", "Adapt", "Next question or coding task follows from the answer."],
  ];
  steps.forEach(([n, h, c], i) => {
    const x = 0.85 + i * 3.0;
    s.addText(n, { x, y: 2.45, w: 0.55, h: 0.38, fontSize: 18, bold: true, color: [C.blue, C.cyan, C.green, C.rose][i], margin: 0 });
    s.addShape(pptx.ShapeType.line, { x: x + 0.62, y: 2.66, w: 1.75, h: 0, line: { color: "CBD5E1", width: 1 } });
    s.addText(h, { x, y: 3.15, w: 1.6, h: 0.32, fontSize: 16, bold: true, color: C.ink, margin: 0 });
    s.addText(c, { x, y: 3.6, w: 2.15, h: 0.75, fontSize: 10, color: C.muted, fit: "shrink", margin: 0 });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 1.0, y: 5.25, w: 10.9, h: 0.7, rectRadius: 0.08, fill: { color: "E0E7FF" }, line: { color: "C7D2FE" } });
  s.addText("Output: technical_score, clarity_score, depth_score, behavior_score, confidence_score, emotion, behavior_feedback, next_question", { x: 1.25, y: 5.48, w: 10.3, h: 0.18, fontSize: 9.4, color: C.blue, bold: true, margin: 0 });
  footer(s, 6);
}

function slide7() {
  const s = pptx.addSlide(); addBg(s, true);
  kicker(s, "Camera + Proctoring", 0.7, 0.58, true);
  title(s, "The interview room creates pressure while monitoring integrity signals.", 0.7, 1.0, 10.1, true, 28);
  s.addShape(pptx.ShapeType.roundRect, { x: 0.9, y: 2.35, w: 4.4, h: 2.65, rectRadius: 0.08, fill: { color: "111D33" }, line: { color: "263650" } });
  s.addText("Participant Camera", { x: 1.18, y: 2.65, w: 2.2, h: 0.25, fontSize: 13, bold: true, color: C.white, margin: 0 });
  s.addShape(pptx.ShapeType.roundRect, { x: 1.18, y: 3.15, w: 3.85, h: 1.2, rectRadius: 0.08, fill: { color: "020617" }, line: { color: "475569" } });
  s.addShape(pptx.ShapeType.ellipse, { x: 2.75, y: 3.33, w: 0.68, h: 0.68, fill: { color: C.cyan, transparency: 10 }, line: { color: C.cyan } });
  s.addText("LIVE", { x: 4.3, y: 2.68, w: 0.45, h: 0.12, fontSize: 7.5, bold: true, color: C.rose, margin: 0 });
  const checks = ["Face presence", "Multiple-person detection", "Tab switch alert", "Restricted object warnings"];
  checks.forEach((t, i) => {
    s.addText(t, { x: 6.15, y: 2.55 + i * 0.55, w: 4.5, h: 0.2, fontSize: 12, bold: true, color: i % 2 ? "C9D5E6" : C.white, margin: 0 });
    s.addShape(pptx.ShapeType.ellipse, { x: 5.82, y: 2.61 + i * 0.55, w: 0.1, h: 0.1, fill: { color: [C.green, C.cyan, C.amber, C.rose][i] }, line: { color: [C.green, C.cyan, C.amber, C.rose][i] } });
  });
  footer(s, 7, true);
}

function slide8() {
  const s = pptx.addSlide(); addBg(s);
  kicker(s, "Code Execution", 0.68, 0.58);
  title(s, "Judge0 makes the code room practical, not just collaborative.", 0.68, 1.0, 9.8, false, 29);
  const langs = [["JavaScript", C.amber], ["Python", C.blue], ["Java", C.rose], ["C++", C.green]];
  langs.forEach(([l, col], i) => pill(s, l, 0.85 + i * 1.55, 2.2, 1.25, col));
  s.addShape(pptx.ShapeType.roundRect, { x: 0.9, y: 3.0, w: 5.2, h: 2.0, rectRadius: 0.08, fill: { color: "07111F" }, line: { color: "1F2A44" } });
  s.addText("Input", { x: 1.2, y: 3.25, w: 1.3, h: 0.18, fontSize: 9, bold: true, color: "94A3B8", charSpace: 1, margin: 0 });
  s.addText("source_code + language_id + stdin", { x: 1.2, y: 3.75, w: 4.3, h: 0.25, fontFace: "Consolas", fontSize: 11, color: "DDE7F7", margin: 0 });
  s.addShape(pptx.ShapeType.chevron, { x: 6.45, y: 3.78, w: 0.55, h: 0.35, fill: { color: C.green }, line: { color: C.green } });
  s.addShape(pptx.ShapeType.roundRect, { x: 7.35, y: 3.0, w: 4.8, h: 2.0, rectRadius: 0.08, fill: { color: "ECFDF5" }, line: { color: "A7F3D0" } });
  s.addText("Output", { x: 7.65, y: 3.25, w: 1.3, h: 0.18, fontSize: 9, bold: true, color: C.green, charSpace: 1, margin: 0 });
  s.addText("stdout, stderr, compile output,\nstatus, time, memory", { x: 7.65, y: 3.72, w: 3.75, h: 0.6, fontSize: 13, bold: true, color: C.ink, margin: 0.02 });
  footer(s, 8);
}

function slide9() {
  const s = pptx.addSlide(); addBg(s, true);
  kicker(s, "Analytics", 0.7, 0.58, true);
  title(s, "Dashboards turn every mock interview into measurable progress.", 0.7, 1.0, 9.8, true, 29);
  const vals = [7.2, 8.1, 6.9, 8.7, 9.1];
  vals.forEach((v, i) => {
    const h = v * 0.28;
    const x = 1.0 + i * 0.78;
    s.addShape(pptx.ShapeType.rect, { x, y: 5.35 - h, w: 0.42, h, fill: { color: [C.blue, C.cyan, C.green, C.amber, C.rose][i] }, line: { color: [C.blue, C.cyan, C.green, C.amber, C.rose][i] } });
    s.addText(String(v), { x: x - 0.05, y: 5.48, w: 0.55, h: 0.16, fontSize: 8.5, color: "9FB2CC", margin: 0 });
  });
  s.addShape(pptx.ShapeType.line, { x: 0.85, y: 5.35, w: 4.1, h: 0, line: { color: "334155", width: 1 } });
  card(s, 6.1, 2.45, 2.15, 1.45, "Scores", "Technical, clarity, depth, behavior, confidence.", C.blue);
  card(s, 8.55, 2.45, 2.15, 1.45, "Alerts", "Tab switch, face missing, multi-person warnings.", C.rose);
  card(s, 6.1, 4.35, 2.15, 1.45, "History", "Recent sessions and domain-wise performance.", C.green);
  card(s, 8.55, 4.35, 2.15, 1.45, "Feedback", "Actionable AI summary for improvement.", C.amber);
  footer(s, 9, true);
}

function slide10() {
  const s = pptx.addSlide(); addBg(s);
  kicker(s, "Roadmap", 0.68, 0.58);
  title(s, "The next build turns mock interviews into a live hiring simulation.", 0.68, 1.0, 10.2, false, 29);
  const road = [
    ["Now", "AI + code room + execution", C.blue],
    ["Next", "Human interviewer WebRTC", C.cyan],
    ["Then", "Screen sharing + interviewer controls", C.green],
    ["Later", "Persistent room recordings and review packs", C.amber],
  ];
  road.forEach(([t, c, col], i) => {
    const x = 0.9 + i * 3.0;
    s.addShape(pptx.ShapeType.ellipse, { x, y: 3.05, w: 0.34, h: 0.34, fill: { color: col }, line: { color: col } });
    if (i < road.length - 1) s.addShape(pptx.ShapeType.line, { x: x + 0.42, y: 3.22, w: 2.25, h: 0, line: { color: "CBD5E1", width: 1.2 } });
    s.addText(t, { x, y: 3.65, w: 1.0, h: 0.22, fontSize: 13, bold: true, color: col, margin: 0 });
    s.addText(c, { x, y: 4.08, w: 2.2, h: 0.72, fontSize: 10.5, color: C.muted, fit: "shrink", margin: 0 });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.9, y: 5.6, w: 11.3, h: 0.72, rectRadius: 0.08, fill: { color: C.ink }, line: { color: C.ink } });
  s.addText("Resume positioning: AI-powered real-time collaborative coding interview platform with camera sessions, code execution, proctoring, and analytics.", { x: 1.15, y: 5.84, w: 10.75, h: 0.2, fontSize: 10.8, color: C.white, bold: true, margin: 0 });
  footer(s, 10);
}

[slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9, slide10].forEach((fn) => fn());

await pptx.writeFile({ fileName: "E:/ai based interview platform/Ai-Interview-Platform-/outputs/manual-20260523-presentations/interviewsync-ai/output/InterviewSync-AI-Project-Presentation.pptx" });
