document.getElementById("sendBtn").addEventListener("click", () => {
  const cmd = document.getElementById("commandInput").value;
  let response;

  if (cmd.toLowerCase().startsWith("summarize")) {
    response = scribeSummarize(cmd);
  } else if (cmd.toLowerCase().startsWith("generate")) {
    response = alchemistGenerate(cmd);
  } else {
    response = oracleAnswer(cmd);
  }

  document.getElementById("responsePanel").innerText = response;
});