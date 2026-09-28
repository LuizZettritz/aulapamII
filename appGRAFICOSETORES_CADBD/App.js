import React, { useState } from "react";

import TelaCadastro from "./telas/TelaCadastro";
import TelaGrafico from "./telas/TelaGrafico";

export default function App() {
  const [tela, setTela] = useState("cadastro");

  if (tela === "grafico") {
    return (
      <TelaGrafico
        voltar={() => setTela("cadastro")}
      />
    );
  }

  return (
    <TelaCadastro
      verGrafico={() => setTela("grafico")}
    />
  );
}