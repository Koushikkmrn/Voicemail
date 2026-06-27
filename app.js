document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items and tabs
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked nav item
            item.classList.add('active');
            
            // Show corresponding tab
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Dashboard Logic ---
    const mainToggle = document.getElementById('main-toggle');
    const statusDot = document.getElementById('system-status-dot');
    const statusText = document.getElementById('system-status-text');

    mainToggle.addEventListener('change', (e) => {
        if(e.target.checked) {
            statusDot.classList.add('active');
            statusText.innerText = 'ACTIVE';
            statusText.style.color = '#FFFFFF';
        } else {
            statusDot.classList.remove('active');
            statusText.innerText = 'OFFLINE';
            statusText.style.color = 'var(--text-dim)';
        }
    });

    // --- Studio Recording Logic (Simulation) ---
    const btnRecord = document.getElementById('btn-record');
    const btnDelete = document.getElementById('btn-delete');
    const btnSave = document.getElementById('btn-save');
    const timeDisplay = document.getElementById('record-time');
    const statusMsg = document.getElementById('studio-status');
    const visualizer = document.getElementById('audio-visualizer');
    
    let isRecording = false;
    let hasRecording = false;
    let recordInterval;
    let seconds = 0;
    
    // Generate visualizer bars
    for(let i=0; i<30; i++) {
        const bar = document.createElement('div');
        bar.className = 'vis-bar';
        visualizer.appendChild(bar);
    }
    const visBars = document.querySelectorAll('.vis-bar');
    let visInterval;

    function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function updateVisualizer() {
        visBars.forEach(bar => {
            if(isRecording) {
                // Random height between 4px and 40px
                const h = Math.floor(Math.random() * 36) + 4;
                bar.style.height = `${h}px`;
                bar.classList.add('recording');
            } else {
                bar.style.height = '4px';
                bar.classList.remove('recording');
            }
        });
    }

    btnRecord.addEventListener('click', () => {
        if(!isRecording) {
            // Start Recording
            isRecording = true;
            hasRecording = false;
            seconds = 0;
            timeDisplay.innerText = formatTime(seconds);
            btnRecord.classList.add('recording');
            statusMsg.innerText = 'Recording...';
            statusMsg.style.color = 'var(--accent-red)';
            
            btnDelete.disabled = true;
            btnSave.disabled = true;

            recordInterval = setInterval(() => {
                seconds++;
                timeDisplay.innerText = formatTime(seconds);
            }, 1000);
            
            visInterval = setInterval(updateVisualizer, 100);

        } else {
            // Stop Recording
            isRecording = false;
            hasRecording = true;
            btnRecord.classList.remove('recording');
            statusMsg.innerText = 'Recording saved locally';
            statusMsg.style.color = 'var(--text-dim)';
            
            clearInterval(recordInterval);
            clearInterval(visInterval);
            updateVisualizer(); // reset bars

            btnDelete.disabled = false;
            btnSave.disabled = false;
        }
    });

    btnDelete.addEventListener('click', () => {
        hasRecording = false;
        seconds = 0;
        timeDisplay.innerText = formatTime(seconds);
        statusMsg.innerText = 'Ready to record';
        btnDelete.disabled = true;
        btnSave.disabled = true;
    });

    btnSave.addEventListener('click', () => {
        statusMsg.innerText = 'Greeting updated successfully';
        statusMsg.style.color = '#FFFFFF';
        setTimeout(() => {
            statusMsg.innerText = 'Ready to record';
            statusMsg.style.color = 'var(--text-dim)';
            btnDelete.disabled = true;
            btnSave.disabled = true;
            seconds = 0;
            timeDisplay.innerText = formatTime(seconds);
        }, 3000);
    });
});
