const president = document.querySelector("#president");
const governor = document.querySelector("#governor");
const stateDeputy = document.querySelector("#state-deputy");
const congressman = document.querySelector("#congressman");
const senator = document.querySelector("#senator");
const update = document.querySelector("#update");
const select = document.querySelector("#coverage");
const button = document.querySelector("#stateToCounty");

// Codigos de eleição
const presidentElectionCode = "9240";
const deputyElectionCode = "9238";

// Dicionario de codigos para cargos
const dictionary = {
  1: "Presidente",
  3: "Governador",
  5: "Senador",
  6: "Deputado Federal",
  7: "Deputado Estadual",
};

// Formata texto (situação) eleito para lista simples
function formatElected(elected) {
  if (elected === "2º turno") {
    return "2T";
  }
  return "E";
}

// Criação de elemento DOM
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

// Criação da barra de progresso DOM
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
    const area = createElement("span", {
      innerHTML: select.dataset.coverage === "uf" ? uf : "SP",
    });
    _role.append(area);
  }

  div1.append(_role, progressPercent);
  div2.append(voters, progressLabel);
  div3.append(votesPercent, absentPercent);
  progress.append(div1, div2, bar, div3);

  return progress;
}

// Criação do candidato simples DOM
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

  if (e.toLowerCase() === "s") {
    const flag = createElement("span", {
      classList: "flag",
      innerHTML: formatElected(st),
    });
    div1.appendChild(flag);
  }

  li.append(div1, div2);

  return li;
}

// Criação do candidato com foto DOM
function generateCandidatePhoto(
  { sqcand, nm, cc, vap, pvap, e, st },
  uf,
  role = ""
) {
  cc = cc.split("-", 1);
  const code = uf === "br" ? presidentElectionCode : deputyElectionCode;

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
    src: `/eleicoes/fotos/${sqcand}.jpeg`,
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

  if (e.toLowerCase() === "s") {
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

// Criação os dados de voto da abrangencia/cargo DOM
function generateData({ vb, pvb, tvn, ptvn, vv, pvvc }) {
  const div1 = document.createElement("div");
  const div2 = document.createElement("div");
  const div3 = document.createElement("div");

  const data = createElement("div", { classList: "data" });
  const blank = createElement("span", { innerHTML: "Brancos" });
  const nullish = createElement("span", { innerHTML: "Nulos" });
  const valid = createElement("span", { innerHTML: "Válidos" });
  const votesB = createElement("span", { innerHTML: vb });
  const votesBPercent = createElement("span", { innerHTML: `${pvb}%` });
  const votesN = createElement("span", { innerHTML: tvn });
  const votesNPercent = createElement("span", { innerHTML: `${ptvn}%` });
  const votesV = createElement("span", { innerHTML: vv });
  const votesVPercent = createElement("span", { innerHTML: `${pvvc}%` });

  div1.append(blank, votesB, votesBPercent);
  div2.append(nullish, votesN, votesNPercent);
  div3.append(valid, votesV, votesVPercent);
  data.append(div1, div2, div3);

  return data;
}

// Inserção de DOM no seu respectivo campo
function generateContent(data, target, uf, role, simple) {
  if (simple) {
    // Geração do container dos candidatos de lista simples
    const simpleContainer = createElement("div", { classList: "simple-list" });
    const ul = createElement("ul", { classList: "scroll-container" });
    simpleContainer.append(ul);

    // Candidatos
    data.candidates.forEach(function (candidate) {
      ul.appendChild(generateCandidate(candidate));
    });

    // Informação de votos
    target.replaceChildren(target.children[0], ul, generateData(data.data));
  } else {
    // Separando os três primeiros candidatos
    const topCandidates = data.candidates.slice(0, 3);
    const bottomCandidates = data.candidates.slice(3);

    // Geração do contianer dos candidatos com fotos
    const photoContainer = createElement("div", {
      classList: "photo-list",
    });

    topCandidates.forEach(function (candidate) {
      photoContainer.appendChild(generateCandidatePhoto(candidate, uf, role));
    });

    // Geração do container dos candidatos de lista simples
    const simpleContainer = createElement("div", {
      classList: "simple-list",
    });
    const ul = document.createElement("ul");
    simpleContainer.append(ul);

    bottomCandidates.forEach(function (candidate) {
      ul.appendChild(generateCandidate(candidate));
    });

    // Inserindo as informações
    target.replaceChildren(
      target.children[0],
      generateElectionProgress(data.progressBar, role, uf),
      photoContainer,
      simpleContainer,
      generateData(data.data)
    );
  }
  const pattern = `${dictionary[role]}\\(\\d{2}:\\d{2}:\\d{2}\\)|${dictionary[role]}\\(\\)`;
  const re = new RegExp(pattern);
  update.innerHTML = update.innerHTML.replace(
    re,
    `${dictionary[role]}(${data.lastUpdate})`
  );
}

// Chamada do request de todos os campos
function generateAllContent() {
  const location = select.value;

  if (location === "sp") {
    getConsolidatedData("br", 1, president);
    getConsolidatedData(location, 3, governor);

    getConsolidatedData(location, 7, stateDeputy, true);
    getConsolidatedData(location, 6, congressman, true);
    getConsolidatedData(location, 5, senator, true);
  } else {
    getVariableData(location, 1, president);
    getVariableData(location, 3, governor);

    getVariableData(location, 7, stateDeputy, true);
    getVariableData(location, 6, congressman, true);
    getVariableData(location, 5, senator, true);
  }
}

// Request dos dados fixos JSON
function getFixedData(data, file, target, county, role, simple = false) {
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
      const candidatesData = data.candidates;
      const candidatesInfo = [];
      const mixed = [];

      // Objeto com informações fixas do candidato
      requestFixed.response.carg.agr.forEach(function (party) {
        party.par.forEach(function (candidates) {
          const com = candidates.sg;

          candidates.cand.forEach(function (candidate) {
            candidatesInfo.push({
              nm: candidate.nmu,
              cc: com,
              sqcand: candidate.sqcand,
              n: candidate.n,
            });
          });
        });
      });

      // Mesclando o objeto candidato com informações com o que tem os dados de votos
      candidatesData.forEach(function (data) {
        const found = candidatesInfo.find(function (info) {
          return data.n === info.n;
        });
        mixed.push({ ...found, ...data });
      });

      // Lista de candidatos organizada por quantidade de votos no municipio
      const candidates = mixed.sort(function (a, b) {
        return b.vap - a.vap;
      });

      // Formatando separação de milhares
      candidates.forEach(function (candidate) {
        candidate.vap = parseInt(candidate.vap).toLocaleString("pt-BR");
      });

      generateContent(
        {
          candidates: candidates,
          data: data.data,
          progressBar: data.progressBar,
          lastUpdate: data.lastUpdate,
        },
        target,
        county,
        role,
        simple
      );
    }
  };
}

// Request dos dados variaveis JSON
function getVariableData(county, role, target, simple = false) {
  const election = role === 1 ? presidentElectionCode : deputyElectionCode;
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
      const foundCounty = response.abr.find(function (element) {
        return element.tpabr === "MU";
      });
      // Ultima atualização do arquivo para o cargo
      const lastUpdate = foundCounty.ht;
      // verifica se há atualização no arquivo.
      if (county === target.dataset.abr && target.dataset.ht === lastUpdate) {
        return false;
      }
      // Objeto com informações dos votos (Brancos, Nulos e Validos)
      const data = {
        vb: parseInt(foundCounty.vb).toLocaleString("pt-BR"),
        pvb: foundCounty.pvb,
        tvn: parseInt(foundCounty.tvn).toLocaleString("pt-BR"),
        ptvn: foundCounty.ptvn,
        vv: parseInt(foundCounty.vv).toLocaleString("pt-BR"),
        pvvc: foundCounty.pvvc,
      };

      // Barra de progresso da contagem de votos
      const progressBar = {
        pst: foundCounty.pst,
        e: parseInt(foundCounty.e).toLocaleString("pt-BR"),
        pc: foundCounty.pc,
        pa: foundCounty.pa,
      };

      // Array de candidatos
      const candidates = foundCounty.cand;
      // Insere a abrangência e horario da ultima atualização como dataset no elemento DOM
      target.dataset.abr = county;
      target.dataset.ht = lastUpdate;

      getFixedData(
        {
          candidates: candidates,
          data: data,
          progressBar: progressBar,
          lastUpdate: lastUpdate,
        },
        file,
        target,
        county,
        role,
        simple
      );
    }
  };
}

// Request dos dados consolidados JSON
function getConsolidatedData(uf, role, target, simple = false) {
  const election = role === 1 ? presidentElectionCode : deputyElectionCode;

  const requestConsolidated = new XMLHttpRequest();
  requestConsolidated.open(
    "GET",
    `/eleicoes/${election}/${uf}/${uf}-c000${role}-e00${election}-r.json`
  );
  requestConsolidated.setRequestHeader(
    "Cache-Control",
    "no-cache, no-store, max-age=0"
  );
  requestConsolidated.responseType = "json";
  requestConsolidated.send();

  requestConsolidated.onreadystatechange = function () {
    if (
      requestConsolidated.readyState === 4 &&
      requestConsolidated.status === 200
    ) {
      const response = requestConsolidated.response;
      // verifica se houve atualização no arquivo
      if (uf === target.dataset.abr && target.dataset.ht === response.ht) {
        return false;
      }
      // Array de candidatos organizada por sequencial
      const candidates = response.cand.sort(function (a, b) {
        return a.seq - b.seq;
      });

      // Formatando separação de milhares
      candidates.forEach(function (candidate) {
        candidate.vap = parseInt(candidate.vap).toLocaleString("pt-BR");
      });

      // Elemento com informações dos votos (Brancos, Nulos e Validos)
      const data = {
        vb: parseInt(response.vb).toLocaleString("pt-BR"),
        pvb: response.pvb,
        tvn: parseInt(response.tvn).toLocaleString("pt-BR"),
        ptvn: response.ptvn,
        vv: parseInt(response.vv).toLocaleString("pt-BR"),
        pvvc: response.pvvc,
      };

      // Barra de progresso da contagem de votos
      const progressBar = {
        pst: response.pst,
        e: parseInt(response.e).toLocaleString("pt-BR"),
        pc: response.pc,
        pa: response.pa,
      };
      // Inserção da Abrangencia e data da ultima totalização do arquivo como dataset do elemento DOM
      target.dataset.abr = uf;
      target.dataset.ht = response.ht;

      generateContent(
        {
          candidates: candidates,
          data: data,
          progressBar: progressBar,
          lastUpdate: response.ht,
        },
        target,
        uf,
        role,
        simple
      );
    }
  };
}

// button.addEventListener("click", stateToCounty);
document.addEventListener("DOMContentLoaded", generateAllContent);
select.addEventListener("change", generateAllContent);

setInterval(generateAllContent, 60 * 1000);
