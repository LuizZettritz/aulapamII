import React, { useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import axios from "axios";

const API_URL =
  "http://10.67.57.113/aulaPAMII/appGraficos";

export default function TelaCadastro({ verGrafico }) {
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");

  async function cadastrar() {
    if (!produto || !quantidade) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos."
      );

      return;
    }

    try {
      const dados = new FormData();

      dados.append("produto", produto);
      dados.append("quantidade", quantidade);

      await axios.post(
        `${API_URL}/cadastrar.php`,
        dados
      );

      Alert.alert(
        "Sucesso",
        "Produto cadastrado!"
      );

      setProduto("");
      setQuantidade("");
    } catch (erro) {
      console.log("Erro ao cadastrar:", erro);

      Alert.alert(
        "Erro",
        "Não foi possível cadastrar."
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        Cadastro de Vendas
      </Text>

      <Text style={styles.label}>
        Produto
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o produto"
        value={produto}
        onChangeText={setProduto}
      />

      <Text style={styles.label}>
        Quantidade
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrar}
      >
        <Text style={styles.textoBotao}>
          CADASTRAR
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoGrafico}
        onPress={verGrafico}
      >
        <Text style={styles.textoBotao}>
          VER GRÁFICO
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
  },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },

  botao: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  botaoGrafico: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});