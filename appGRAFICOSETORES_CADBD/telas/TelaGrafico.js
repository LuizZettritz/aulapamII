import React, { useEffect, useState } from "react";

import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import axios from "axios";

import {
  PieChart,
} from "react-native-chart-kit";

const API_URL =
  "http://10.67.57.113/aulaPAMII/appGraficos";

export default function TelaGrafico({ voltar }) {
  const [dadosGrafico, setDadosGrafico] = useState([]);

  async function carregarGrafico() {
    try {
      const resposta = await axios.get(
        `${API_URL}/listar.php`
      );

      const cores = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
      ];

      const dados = resposta.data.map(
        (item, index) => ({
          name: item.produto,

          quantidade: Number(
            item.quantidade
          ),

          color:
            cores[index % cores.length],

          legendFontColor: "#333",

          legendFontSize: 14,
        })
      );

      setDadosGrafico(dados);
    } catch (erro) {
      console.log(
        "Erro ao carregar gráfico:",
        erro
      );
    }
  }

  useEffect(() => {
    carregarGrafico();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        Gráfico de Vendas
      </Text>

      {dadosGrafico.length > 0 ? (
        <PieChart
          data={dadosGrafico}
          width={
            Dimensions.get("window").width - 20
          }
          height={250}
          accessor="quantidade"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          chartConfig={{
            color: () => "#000",
          }}
        />
      ) : (
        <Text style={styles.semDados}>
          Nenhum dado cadastrado.
        </Text>
      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={voltar}
      >
        <Text style={styles.textoBotao}>
          VOLTAR
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
  },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },

  semDados: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 30,
  },

  botao: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 30,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});