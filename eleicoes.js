const president = document.querySelector("#president");
const governor = document.querySelector("#governor");
const stateDeputy = document.querySelector("#state-deputy");
const congressman = document.querySelector("#congressman");
const senator = document.querySelector("#senator");
const update = document.querySelector("#update");
const uf = document.querySelector("#governor select");

function formatElected(elected) {
  if (elected === "2º turno") {
    return "2T";
  }
  return "E";
}

function generateElectionProgress({ pst, e, pc, pa }, role, uf) {
  const isPresident = role === 1;

  const progress = document.createElement("div");
  progress.classList.add("election-progress");

  const div1 = document.createElement("div");
  const div2 = document.createElement("div");
  const div3 = document.createElement("div");

  const progressLabel = document.createElement("span");
  progressLabel.innerHTML = "Urnas apuradas";

  const bar = document.createElement("div");
  bar.classList.add("bar");
  bar.style = `background: linear-gradient(
    90deg, 
    #4eb33a 0%,  
    #4eb33a ${parseFloat(pst) * (parseFloat(pc) / 100)}%, 
    #2c6c1f ${parseFloat(pst) * (parseFloat(pc) / 100)}%, 
    #2c6c1f ${parseFloat(pst)}%, 
    transparent ${parseFloat(pst)}%, 
    transparent 100%);`;

  const _role = document.createElement("span");
  _role.innerHTML = isPresident ? "Presidente " : "Governador ";

  const progressPercent = document.createElement("span");
  progressPercent.innerHTML = `${pst}%`;

  const voters = document.createElement("span");
  voters.innerHTML = `${e} eleitores`;

  const votesPercent = document.createElement("span");
  votesPercent.innerHTML = `${pc}% votantes`;

  const absentPercent = document.createElement("span");
  absentPercent.innerHTML = `${pa}% ausentes`;

  if (!isPresident) {
    const area = document.createElement("span");
    area.setAttribute("data-location", "");
    area.innerHTML = uf;
    _role.append(area);
  }

  div1.append(_role, progressPercent);
  div2.append(voters, progressLabel);
  div3.append(votesPercent, absentPercent);

  progress.append(div1, div2, bar, div3);

  return progress;
}

function generateCandidate({ nm, cc, vap, pvap, e, st }) {
  cc = cc.split("-", 1);

  const name = document.createElement("span");
  name.innerHTML = nm;

  const party = document.createElement("span");
  party.innerHTML = cc;

  const votes = document.createElement("span");
  votes.innerHTML = vap;

  const votesPercent = document.createElement("span");
  votesPercent.innerHTML = `${pvap}%`;

  const div1 = document.createElement("div");
  const div2 = document.createElement("div");
  const li = document.createElement("li");

  div1.append(name, party);
  div2.append(votesPercent, votes);

  if (e === "s") {
    const flag = document.createElement("span");
    flag.classList.add("flag");
    st = formatElected(st);
    flag.innerHTML = st;
    div1.appendChild(flag);
  }

  li.append(div1, div2);

  return li;
}

function generateCandidatePhoto({ sqcand, nm, cc, vap, pvap, e, st }, uf) {
  cc = cc.split("-", 1);
  const code = uf === "br" ? "9240" : "9238";

  const div2 = document.createElement("div");
  const div1 = document.createElement("div");

  const candidate = document.createElement("div");
  candidate.classList.add("candidate");

  const circle = document.createElement("div");
  circle.classList.add("circle");

  if (parseFloat(pvap) < 50) {
    circle.style = `background: linear-gradient(to right, lightgray 50%, transparent 50%),
     linear-gradient(${
       90 + parseFloat(pvap) * 3.6
     }deg, #4eb33a 50%, lightgray 50%, lightgray);`;
  } else {
    circle.style = `background: linear-gradient(to left, #4eb33a 50%, transparent 50%),
    linear-gradient(${
      90 + parseFloat(pvap) * 3.6
    }deg, #4eb33a 50%, lightgray 50%, lightgray);`;
  }

  const photo = document.createElement("img");
  photo.src = `https://resultados-sim.tse.jus.br/teste/ele2022/${code}/fotos/${uf}/${sqcand}.jpeg`;

  const party = document.createElement("span");
  party.innerHTML = cc;

  const data = document.createElement("div");
  data.classList.add("data");

  const votesPercent = document.createElement("span");
  votesPercent.innerHTML = pvap;

  const percent = document.createElement("span");
  percent.innerHTML = "%";

  const votes = document.createElement("p");
  votes.innerHTML = vap;

  const spanVotes = document.createElement("span");
  spanVotes.innerHTML = "votos";

  const name = document.createElement("span");
  name.innerHTML = nm;

  if (e === "s") {
    const flag = document.createElement("span");
    flag.classList.add("flag");
    flag.innerHTML = st;

    div1.append(flag);
  }

  candidate.append(div1, data, name, party);
  circle.append(photo);
  div1.append(circle);
  data.append(votesPercent, div2);
  votesPercent.append(percent);
  div2.append(votes, spanVotes);

  return candidate;
}

function generateData({ vb, pvb, tvn, ptvn, vv, pvvc }) {
  const div1 = document.createElement("div");
  const div2 = document.createElement("div");
  const div3 = document.createElement("div");

  const data = document.createElement("div");
  data.classList.add("data");

  const blank = document.createElement("span");
  blank.innerHTML = "Brancos";

  const nullishe = document.createElement("span");
  nullishe.innerHTML = "Nulos";

  const valid = document.createElement("span");
  valid.innerHTML = "Válidos";

  const votesB = document.createElement("span");
  votesB.innerHTML = vb;

  const votesBPercent = document.createElement("span");
  votesBPercent.innerHTML = `${pvb}%`;

  const votesN = document.createElement("span");
  votesN.innerHTML = tvn;

  const votesNPercent = document.createElement("span");
  votesNPercent.innerHTML = `${ptvn}%`;

  const votesV = document.createElement("span");
  votesV.innerHTML = vv;

  const votesVPercent = document.createElement("span");
  votesVPercent.innerHTML = `${pvvc}%`;

  div1.append(blank, votesB, votesBPercent);
  div2.append(nullishe, votesN, votesNPercent);
  div3.append(valid, votesV, votesVPercent);

  data.append(div1, div2, div3);

  return data;
}

function generateContent(target, uf, role, simple = false) {
  const election = role === 1 ? "9240" : "9238";

  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `/eleicoes/${election}/${uf}/${uf}-c000${role}-e00${election}-r.json`
  );
  xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
  xhr.responseType = "json";
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Lista de candidatos organizada por sequencial
      const candidates = xhr.response.cand.sort(function (a, b) {
        return a.seq - b.seq;
      });

      // Formatando separação de milhares
      candidates.forEach(function (candidate) {
        candidate.vap = parseInt(candidate.vap).toLocaleString("pt-BR");
      });

      // Elemento com informações dos votos (Brancos, Nulos e Validos)
      const data = {
        vb: parseInt(xhr.response.vb).toLocaleString("pt-BR"),
        pvb: xhr.response.pvb,
        tvn: parseInt(xhr.response.tvn).toLocaleString("pt-BR"),
        ptvn: xhr.response.ptvn,
        vv: parseInt(xhr.response.vv).toLocaleString("pt-BR"),
        pvvc: xhr.response.pvvc,
      };

      // Barra de progresso da contagem de votos
      const progressBar = {
        pst: xhr.response.pst,
        e: parseInt(xhr.response.e).toLocaleString("pt-BR"),
        pc: xhr.response.pc,
        pa: xhr.response.pa,
      };

      if (simple) {
        // Geração do container dos candidatos de lista simples
        const simpleContainer = document.createElement("div");
        simpleContainer.classList.add("simple-list");

        const ul = document.createElement("ul");
        ul.classList.add("scroll-container");

        simpleContainer.append(ul);

        candidates.forEach(function (candidate) {
          ul.appendChild(generateCandidate(candidate));
        });

        target.replaceChildren(target.children[0], ul, generateData(data));
      } else {
        // Separando os três primeiros candidatos
        const topCandidates = candidates.slice(0, 3);
        const bottomCandidates = candidates.slice(3);

        // Geração do contianer dos candidatos com fotos
        const photoContainer = document.createElement("div");
        photoContainer.classList.add("photo-list");

        topCandidates.forEach(function (candidate) {
          photoContainer.appendChild(generateCandidatePhoto(candidate, uf));
        });

        // Geração do container dos candidatos de lista simples
        const simpleContainer = document.createElement("div");
        simpleContainer.classList.add("simple-list");

        const ul = document.createElement("ul");
        simpleContainer.append(ul);

        bottomCandidates.forEach(function (candidate) {
          ul.appendChild(generateCandidate(candidate));
        });

        // Inserindo as informações
        target.replaceChildren(
          target.children[0],
          generateElectionProgress(progressBar, role, uf),
          photoContainer,
          simpleContainer,
          generateData(data)
        );
      }

      // Mensagem de ultima atualização, do arquivo de presidente
      if (role === 1) {
        update.innerHTML = `Última atualização: ${xhr.response.ht} - ${xhr.response.dt}`;
      }
    }
  };
}

function generateAllContent() {
  generateContent(president, "br", 1);
  generateContent(governor, uf.value, 3);

  generateContent(stateDeputy, uf.value, uf.value === "df" ? 8 : 7, true);
  generateContent(congressman, uf.value, 6, true);
  generateContent(senator, uf.value, 5, true);

  const locations = document.querySelectorAll("[data-location]");
  locations.forEach(function (location) {
    location.innerHTML = uf.value;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  generateAllContent();
});

uf.addEventListener("change", function () {
  generateAllContent();
});

// setInterval(generateAllContent, 60 * 1000);
