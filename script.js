
  document.addEventListener("DOMContentLoaded", function() {
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        createGameCards(data.games);
        createTranslatorCards(data.translators);

        VanillaTilt.init(document.querySelectorAll(".card-custom"), {
          max: 10,
          speed: 1000,
          glare: true,
          "max-glare": 0.6,
          scale: 1.05,
          perspective: 1000,
          transition: true,
          easing: "cubic-bezier(.03,.98,.52,.99)",
          gyroscope: true,
          reset: true
        });

        const cardCustoms = document.querySelectorAll(".card-custom");
        cardCustoms.forEach(card => {
          card.addEventListener("tiltChange", function (event) {
            let { x, y } = event.detail;
            let percentageX = Math.abs(x);
            let percentageY = Math.abs(y);

            let color1 = `rgba(${255 * percentageX}, ${255 * (1 - percentageY)}, 150, 0.2)`;
            let color2 = `rgba(128, ${255 * percentageY}, ${255 * percentageX}, 0.2)`;

            card.style.setProperty('--foil-color1', color1);
            card.style.setProperty('--foil-color2', color2);
          });
        });
      });
  });

  function createGameCards(games) {
    const container = document.querySelector('.cards-container .row');
    games.forEach(game => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4 mb-4';
      col.innerHTML = `
        <div class="card card-custom">
          <img src="${game.image}" alt="${game.title}">
        </div>
      `;
      container.appendChild(col);
    });
  }

  function createTranslatorCards(translators) {
    const container = document.querySelector('#translators');
    translators.forEach(translator => {
      const col = document.createElement('div');
      col.className = 'col-md-4 col-sm-6 mb-4 about-us-card-custom-flex';
      col.innerHTML = `
        <div class="card about-us-card-custom">
          <div class="card-body d-flex align-items-center">
            <img src="${translator.image}" alt="${translator.name}" class="card-img-top me-3" />
            <div>
              <h5 class="card-title">${translator.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${translator.role}</h6>
              <p class="card-text">${translator.bio}</p>
              <div class="social-links">
                ${translator.socialLinks ? translator.socialLinks.map(link => `
                  <a href="${link.url.trim()}" target="_blank" class="social-icon">
                    <i class="fa fa-${link.network}"></i>
                  </a>
                `).join('') : ''}
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  }

  const wrongTexts = ["наше порволіо", "Наше портфольо"];
  const correctText = "Наше портфоліо";
  let typedText = "";
  let currentCharIndex = 0;
  let mistakeIndex = 0;
  let isErasing = false;

  const typedTextElement = document.getElementById("typed-text");
  const cursor = document.querySelector(".cursor");

  function typeAndErase() {
    const currentWrongText = wrongTexts[mistakeIndex];
    if (!isErasing) {
      if (currentCharIndex < currentWrongText.length) {
        typedText += currentWrongText.charAt(currentCharIndex);
        typedTextElement.innerHTML = typedText;
        currentCharIndex++;
        setTimeout(typeAndErase, 150);
      } else {
        setTimeout(() => {
          isErasing = true;
          setTimeout(typeAndErase, 500);
        }, 1000);
      }
    } else {
      if (currentCharIndex > 0) {
        typedText = typedText.slice(0, -1);
        typedTextElement.innerHTML = typedText;
        currentCharIndex--;
        setTimeout(typeAndErase, 100);
      } else {
        if (mistakeIndex < wrongTexts.length - 1) {
          isErasing = false;
          mistakeIndex++;
          currentCharIndex = 0;
          setTimeout(typeAndErase, 500);
        } else {
          typeCorrectText();
        }
      }
    }
  }

  function typeCorrectText() {
    if (currentCharIndex < correctText.length) {
      typedText += correctText.charAt(currentCharIndex);
      typedTextElement.innerHTML = typedText;
      currentCharIndex++;
      setTimeout(typeCorrectText, 150);
    } else {
      cursor.style.display = 'inline-block';
    }
  }

  setTimeout(typeAndErase, 500);
