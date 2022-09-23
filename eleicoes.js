const president = document.querySelector("#president");
const governor = document.querySelector("#governor");
const stateDeputy = document.querySelector("#state-deputy");
const congressman = document.querySelector("#congressman");
const senator = document.querySelector("#senator");
const update = document.querySelector("#update");
const uf = document.querySelector("#governor select");

function createElement(elementTag, options = {}) {
  const element = document.createElement(elementTag);
  Object.entries(options).forEach(function ([key, value]) {
    if (typeof element[key] === "function" && key.slice(0, 1) !== "on") {
      element[key](value);
    } else {
      element[key] = value;
    }
  });

  return element;
}

function formatElected(elected) {
  if (elected === "2º turno") {
    return "2T";
  }
  return "E";
}

function generateElectionProgress({ pst, e, pc, pa }, role, uf) {
  const isPresident = role === 1;

  const div1 = document.createElement("div");
  const div2 = document.createElement("div");
  const div3 = document.createElement("div");

  const progress = createElement("div", { classList: "election-progress" });
  const progressLabel = createElement("span", { innerHTML: "Urnas apuradas" });
  const progressPercent = createElement("span", { innerHTML: `${pst}%` });
  const voters = createElement("span", { innerHTML: `${e} eleitores` });
  const votesPercent = createElement("span", { innerHTML: `${pc}% votantes` });
  const absentPercent = createElement("span", { innerHTML: `${pa}% ausentes` });

  const _role = createElement("span", {
    innerHTML: isPresident ? "Presidente " : "Governador ",
  });

  const bar = createElement("div", {
    classList: "bar",
    style: `background: linear-gradient(
    90deg, 
    #4eb33a 0%,  
    #4eb33a ${parseFloat(pst) * (parseFloat(pc) / 100)}%, 
    #2c6c1f ${parseFloat(pst) * (parseFloat(pc) / 100)}%, 
    #2c6c1f ${parseFloat(pst)}%, 
    transparent ${parseFloat(pst)}%, 
    transparent 100%);`,
  });

  if (!isPresident) {
    const area = createElement("span", { "data-location": "", innerHTML: uf });
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

  const name = createElement("span", { innerHTML: nm });
  const party = createElement("span", { innerHTML: cc });
  const votes = createElement("span", { innerHTML: vap });
  const votesPercent = createElement("span", { innerHTML: `${pvap}%` });

  const div1 = document.createElement("div");
  const div2 = document.createElement("div");
  const li = document.createElement("li");

  div1.append(name, party);
  div2.append(votesPercent, votes);

  if (e === "s") {
    const flag = createElement("span", {
      classList: "flag",
      innerHTML: formatElected(st),
    });
    div1.appendChild(flag);
  }

  li.append(div1, div2);

  return li;
}

function generateCandidatePhoto({ sqcand, nm, cc, vap, pvap, e, st }, uf) {
  cc = cc.split("-", 1);
  const code = uf === "br" ? "9240" : "9238";

  const div1 = document.createElement("div");
  const div2 = document.createElement("div");

  const candidate = createElement("div", { classList: "candidate" });
  const circle = createElement("div", { classList: "circle" });
  const data = createElement("div", { classList: "data" });
  const party = createElement("span", { innerHTML: cc });
  const votesPercent = createElement("span", { innerHTML: pvap });
  const name = createElement("span", { innerHTML: nm });
  const votes = createElement("p", { innerHTML: vap });
  const percent = createElement("span", { innerHTML: "%" });
  const spanVotes = createElement("span", { innerHTML: "votos" });

  const photo = createElement("img", {
    src: `https://resultados-sim.tse.jus.br/teste/ele2022/${code}/fotos/${uf}/${sqcand}.jpeg`,
  });

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

  if (e === "s") {
    const flag = createElement("span", { classList: "flag", innerHTML: st });
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

  const data = createElement("div", { classList: "data" });
  const blank = createElement("span", { innerHTML: "Brancos" });
  const nullishe = createElement("span", { innerHTML: "Nulos" });
  const valid = createElement("span", { innerHTML: "Válidos" });
  const votesB = createElement("span", { innerHTML: vb });
  const votesBPercent = createElement("span", { innerHTML: `${pvb}%` });
  const votesN = createElement("span", { innerHTML: tvn });
  const votesNPercent = createElement("span", { innerHTML: `${ptvn}%` });
  const votesV = createElement("span", { innerHTML: vv });
  const votesVPercent = createElement("span", { innerHTML: `${pvvc}%` });

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

window.addEventListener("DOMContentLoaded", function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/serviceWorker.js", {
        scope: "/",
      })
      .then((registration) => {
        const sw =
          registration.installing ||
          registration.waiting ||
          registration.active;
      });
  }
});

// --------------------------------------

function getFixedContent(file, data, candidatesData) {
  const requestFixed = new XMLHttpRequest();

  requestFixed.open("GET", `/eleicoes/fixo/${file}.json`);
  requestFixed.setRequestHeader(
    "Cache-Control",
    "no-cache, no-store, max-age=0"
  );
  requestFixed.responseType = "json";
  requestFixed.send();

  requestFixed.onreadystatechange = function () {
    if (requestFixed.status === 200 && requestFixed.readyState === 4) {
      const candidatesInfo = [];
      const mixed = [];

      requestFixed.response.carg.agr.forEach(function (party) {
        const com = party.com.split(" /", 1)[0];

        // Objeto com informações fixas do candidato
        party.par.forEach(function (candidates) {
          candidates.cand.forEach(function (candidate) {
            candidatesInfo.push({
              nm: candidate.nm,
              cc: com,
              sqcand: candidate.sqcand,
              n: candidate.n,
            });
          });
        });
      });

      // Mesclando o objeto com informações com o que tem os dados de votos
      candidatesData.forEach(function (data) {
        const found = candidatesInfo.find(function (info) {
          return data.n === info.n;
        });
        mixed.push({ ...found, ...data });
      });

      return mixed;
    }
  };
}

function getVariableContent(county, role) {
  const election = role === 1 ? 9240 : 9238;
  const requestVariable = new XMLHttpRequest();

  requestVariable.open(
    "GET",
    `/eleicoes/${election}/${county}/sp${county}-c000${role}-e00${election}-v.json`
  );
  requestVariable.setRequestHeader(
    "Cache-Control",
    "no-cache, no-store, max-age=0"
  );
  requestVariable.responseType = "json";
  requestVariable.send();

  requestVariable.onreadystatechange = function () {
    if (requestVariable.status === 200 && requestVariable.readyState === 4) {
      const response = requestVariable.response;

      // Nome do arquivo fixo ligado as informações deste
      const file = response.nadf;

      // Filtra o array de zonas para apenas o geral do municipio
      const county = response.abr.find(function (element) {
        return element.tpabr === "MU";
      });

      // Objeto com informações dos votos (Brancos, Nulos e Validos)
      const data = {
        vb: parseInt(county.vb).toLocaleString("pt-BR"),
        pvb: county.pvb,
        tvn: parseInt(county.tvn).toLocaleString("pt-BR"),
        ptvn: county.ptvn,
        vv: parseInt(county.vv).toLocaleString("pt-BR"),
        pvvc: county.pvvc,
      };

      // Array de candidatos
      const candidates = county.cand;

      getFixedContent(file, data, candidates);
    }
  };
}
