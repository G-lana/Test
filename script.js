document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('button');
    const output1 = document.getElementById('output1');
    const output2 = document.getElementById('output2');
    const output3 = document.getElementById('output3');
    let serverUrl;

    const forms = ['rectangle', 'triangle', 'square', 'circle'];
    const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet'];

    const randomForm = forms[Math.floor(Math.random() * forms.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    button.classList.add(randomForm);
    if (randomForm === 'triangle') {
        button.style.borderBottomColor = randomColor;
    } else {
        button.style.backgroundColor = randomColor;
    }

    fetch('api.cfg')
        .then(response => response.text())
        .then(text => {
            serverUrl = text.trim();
        })
        .catch(error => {
            console.error('Error loading config:', error);
        });

    button.addEventListener('click', () => {
        button.disabled = true;
        button.style.backgroundColor = 'grey';

        fetch(`${serverUrl}/api/button`, {
            method: 'GET',
            mode: 'cors'
        })
            .then(response => response.json())
            .then(data => {
                if (data.form && data.color) {
                    button.className = `button ${data.form}`;
                    if (data.form === 'triangle') {
                        button.style.borderBottomColor = data.color;
                        button.style.backgroundColor = 'transparent';
                    } else {
                        button.style.backgroundColor = data.color;
                        button.style.borderBottomColor = 'transparent';
                    }
                    output1.textContent = `Form: ${data.form}`;
                    output2.textContent = `Color: ${data.color}`;
                } else {
                    output1.textContent = 'Error: Invalid data received';
                    output2.textContent = '';
                }
            })
            .catch(error => {
                output1.textContent = 'Error: Failed to fetch data';
                output2.textContent = '';
                console.error('Error fetching button data:', error);
            })
            .finally(() => {
                button.disabled = false;
            });

        setTimeout(() => {
            if (button.disabled) {
                button.disabled = false;
                button.style.backgroundColor = '';
                output1.textContent = 'Timeout: No response received';
                output2.textContent = '';
            }
        }, 5000);

        fetchRandomData();
    });

    function fetchRandomData() {
        fetch(`${serverUrl}/api/random`, {
            method: 'GET',
            mode: 'cors'
        })
            .then(response => response.json())
            .then(data => {
                if (data.answer) {
                    output3.textContent = `Random: ${data.answer}`;
                } else {
                    output3.textContent = 'Error: Invalid random data';
                }
            })
            .catch(error => {
                output3.textContent = 'Error: Failed to fetch random data';
                console.error('Error fetching random data:', error);
            });

        setTimeout(fetchRandomData, 1000);
    }
});
