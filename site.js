/* Quiz: instant on-page plan, copy button, manual email draft, and OPTIONAL
   automatic email follow-up via FormSubmit (only when the visitor opts in
   by entering name + email and pressing send). No analytics, cookies, or
   browser storage. */
(() => {
  'use strict';
  const form = document.querySelector('#quiz-form');
  if (!form) return;
  const action = document.querySelector('#q4');
  const deadline = document.querySelector('#q-deadline');
  const plan = document.querySelector('#quiz-plan');
  const message = document.querySelector('#quiz-msg');
  const share = document.querySelector('#quiz-email');
  const copy = document.querySelector('#quiz-copy');
  const pathLabel = document.querySelector('#selected-path');
  const followup = document.querySelector('#quiz-followup');
  const sendBtn = document.querySelector('#quiz-send');
  const progressBar = document.querySelector('#quiz-progress');
  const progressFill = document.querySelector('#quiz-progress-fill');
  const fields = ['q1', 'q2', 'q3', 'q4'].map(id => document.querySelector('#' + id)).concat([deadline]);
  let selectedPath = 'General accountability';
  let planText = '';
  let answers = [];
  const paths = {
    divorce: {
      label: 'Navigating divorce',
      q: [
        ['What part of daily life would you like to make steadier?', 'A routine, priority, or commitment within your control.'],
        ['Where does the divorce transition create the most friction right now?', 'The decisions, paperwork, or routines that feel heaviest.'],
        ['What is one practical matter within your control this week?', 'Something concrete you can act on — not legal advice territory.']
      ]
    },
    recovery: {
      label: 'Rebuilding in recovery',
      q: [
        ['What everyday goal would you like accountability around?', 'A practical goal alongside your existing recovery care and support.'],
        ['Where does your routine feel shakiest right now?', 'Mornings, evenings, weekends — be honest, no judgment.'],
        ['What is one commitment you can keep this week alongside your recovery support?', 'Something realistic and within your control.']
      ]
    },
    general: {
      label: 'General accountability',
      q: [
        ['What do you want to build, change, or finish?', 'The goal, project, or habit you want to work on.'],
        ['Where does your progress usually stall?', 'The point where things tend to fall apart.'],
        ['What could you realistically complete this week?', 'Something concrete — what, when, where.']
      ]
    }
  };
  function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  deadline.min = today();
  function updateProgress() {
    const filled = fields.filter(f => f && f.value.trim()).length;
    const pct = Math.round((filled / fields.length) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressBar) progressBar.setAttribute('aria-valuenow', String(pct));
  }
  function invalidatePlan() {
    plan.hidden = true;
    if (followup) followup.hidden = true;
    planText = '';
    message.textContent = '';
    message.className = 'form-msg';
    if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Send me my plan'; }
    updateProgress();
  }
  form.addEventListener('input', () => {
    invalidatePlan();
    updateProgress();
  });
  document.querySelectorAll('.path-btn').forEach(button => {
    button.setAttribute('aria-controls', 'quiz-form');
    button.addEventListener('click', () => {
      const config = paths[button.dataset.path];
      if (!config) return;
      selectedPath = config.label;
      pathLabel.textContent = `Your focus: ${selectedPath}`;
      pathLabel.hidden = false;
      // Swap in the path-specific questions; keep anything already written.
      config.q.forEach((qq, i) => {
        const label = document.querySelector(`label[for="q${i + 1}"]`);
        if (label && label.lastChild) label.lastChild.textContent = ` ${qq[0]}`;
        const field = document.querySelector(`#q${i + 1}`);
        if (field) field.placeholder = qq[1];
      });
      invalidatePlan();
      document.querySelector('#q1').focus();
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    deadline.min = today();
    action.setCustomValidity(action.value.trim() ? '' : 'Name a small action you can take.');
    if (!form.reportValidity()) return;
    answers = ['q1', 'q2', 'q3', 'q4'].map(id => document.querySelector('#' + id).value.trim());
    const dateText = new Date(`${deadline.value}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    document.querySelector('#quiz-action').textContent = answers[3];
    document.querySelector('#quiz-by').textContent = dateText;
    planText = `My DreamWalker first move\nFocus: ${selectedPath}\n\nMy first move is ${answers[3]}, by ${dateText}.`;
    const context = ['My goal', 'Where I am now', 'What gets in the way'].map((label, i) => {
      return answers[i] ? `${label}: ${answers[i]}` : '';
    }).filter(Boolean).join('\n');
    share.href = `mailto:morpheus@dreamwalkercoaching.com?subject=${encodeURIComponent('My DreamWalker first move')}&body=${encodeURIComponent(`Hi Morpheus,\n\nI would like to talk about accountability coaching.\n\n${planText}\n\n${context}\n\nMy preferred times for a call are: `)}`;
    plan.hidden = false;
    if (followup) followup.hidden = false;
    message.textContent = 'Your plan is ready. Nothing has been sent — share it below if you want my personal take.';
    message.className = 'form-msg ok';
    copy.textContent = 'Copy my plan';
    updateProgress();
    plan.focus();
  });
  action.addEventListener('input', () => action.setCustomValidity(''));
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(planText);
      copy.textContent = 'Copied';
      message.textContent = 'Plan copied. Paste it into your notes or calendar.';
    } catch {
      message.textContent = 'Select and copy the plan text above, or use the email option.';
    }
  });
  if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
      const name = document.querySelector('#quiz-name').value.trim();
      const email = document.querySelector('#quiz-email-input').value.trim();
      if (!name || !/[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)) {
        message.textContent = 'Add your name and a valid email so I know where to send it.';
        message.className = 'form-msg err';
        return;
      }
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending…';
      try {
        const payload = {
          name: name,
          email: email,
          _subject: 'New First-Move Quiz — DreamWalker',
          _template: 'table',
          _honey: '',
          'Focus': selectedPath,
          'Q1 - Goal': answers[0],
          'Q2 - Where now': answers[1],
          'Q3 - Obstacle': answers[2],
          'Q4 - First step': answers[3],
          'Deadline': deadline.value
        };
        const res = await fetch('https://formsubmit.co/ajax/morpheus@dreamwalkercoaching.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('send failed');
        message.textContent = 'Sent. Watch your inbox — your personal first-move plan is coming within a day or two.';
        message.className = 'form-msg ok';
        sendBtn.textContent = 'Sent ✓';
      } catch (err) {
        message.textContent = 'Something went wrong. Use the email draft option above instead.';
        message.className = 'form-msg err';
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send me my plan';
      }
    });
  }
  updateProgress();
})();
