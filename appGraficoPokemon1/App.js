
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

const API_URL =
  "http://localhost/AulaPamII/pokemon/geragraficos.php";

export default function App() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        return resposta.json();
      })
      .then((json) => {
        if (!Array.isArray(json)) {
          throw new Error("A API não retornou uma lista de dados.");
        }

        setDados(json);
      })
      .catch((err) => {
        console.error(err);
        setErro(
          "Não foi possível carregar os dados. Confira o IP, o Apache e o banco MySQL."
        );
      })
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <SafeAreaView style={styles.telaCentralizada}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF8DB" />
        <ActivityIndicator size="large" color="#E3350D" />
        <Text style={styles.textoCarregando}>Carregando a Pokédex...</Text>
      </SafeAreaView>
    );
  }

  if (erro) {
    return (
      <SafeAreaView style={styles.telaCentralizada}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF8DB" />
        <Text style={styles.iconeErro}>⚡</Text>
        <Text style={styles.tituloErro}>Ops!</Text>
        <Text style={styles.textoErro}>{erro}</Text>
      </SafeAreaView>
    );
  }

  const nomes = dados.map((item) => item.nome);
  const votos = dados.map((item) => Number(item.valor));
  const totalVotos = votos.reduce((total, valor) => total + valor, 0);
  const maisVotado = dados.length > 0 ? dados[0] : null;

  const dadosGrafico = {
    labels: nomes,
    datasets: [{ data: votos }],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8DB" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <View style={styles.pokebola}>
            <View style={styles.pokebolaTopo} />
            <View style={styles.pokebolaLinha} />
            <View style={styles.pokebolaCentro} />
          </View>
          <Text style={styles.titulo}>Pokémon</Text>
          <Text style={styles.subtitulo}>
            Resultado de uma enquete de Pokémon favoritos
          </Text>
        </View>

        <View style={styles.cardDestaque}>
          <Text style={styles.iconeDestaque}>🏆</Text>
          <View style={styles.destaqueTexto}>
            <Text style={styles.rotuloDestaque}>Mais votado</Text>
            <Text style={styles.nomeDestaque}>
              {maisVotado ? maisVotado.nome : "-"}
            </Text>
          </View>
          <Text style={styles.valorDestaque}>
            {maisVotado ? `${maisVotado.valor} votos` : ""}
          </Text>
        </View>

        <View style={styles.cardGrafico}>
          <Text style={styles.tituloGrafico}>Votos por Pokémon</Text>
          <Text style={styles.descricaoGrafico}>
            Dados de exemplo armazenados no MySQL
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={dadosGrafico}
              width={Math.max(Dimensions.get("window").width - 48, 560)}
              height={300}
              fromZero
              showValuesOnTopOfBars
              withInnerLines
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={styles.grafico}
            />
          </ScrollView>
        </View>

        <View style={styles.resumoLinha}>
          <View style={styles.cardResumo}>
            <Text style={styles.numeroResumo}>{dados.length}</Text>
            <Text style={styles.rotuloResumo}>Pokémon</Text>
          </View>

          <View style={styles.cardResumo}>
            <Text style={styles.numeroResumo}>{totalVotos}</Text>
            <Text style={styles.rotuloResumo}>Votos totais</Text>
          </View>
        </View>

        <View style={styles.cardRanking}>
          <Text style={styles.tituloRanking}>Ranking da enquete</Text>

          {dados.map((item, index) => {
            const percentual =
              totalVotos > 0 ? (Number(item.valor) / totalVotos) * 100 : 0;

            return (
              <View
                key={item.id ?? `${item.nome}-${index}`}
                style={styles.rankingItem}
              >
                <View style={styles.posicao}>
                  <Text style={styles.posicaoTexto}>{index + 1}</Text>
                </View>

                <View style={styles.rankingConteudo}>
                  <View style={styles.rankingTopo}>
                    <Text style={styles.nomePokemon}>{item.nome}</Text>
                    <Text style={styles.votosPokemon}>{item.valor} votos</Text>
                  </View>

                  <View style={styles.barraFundo}>
                    <View
                      style={[
                        styles.barraPreenchida,
                        { width: `${percentual}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.rodape}>Gráfico de Barras com Banco de Dados</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#FFFDF0",
  backgroundGradientTo: "#FFF3B0",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(42, 117, 187, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(36, 64, 94, ${opacity})`,
  fillShadowGradient: "#2A75BB",
  fillShadowGradientOpacity: 1,
  propsForBackgroundLines: {
    stroke: "#E8D98E",
    strokeDasharray: "4",
  },
  propsForLabels: {
    fontSize: 11,
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8DB",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF8DB",
  },
  conteudo: {
    padding: 16,
    paddingBottom: 32,
  },
  telaCentralizada: {
    flex: 1,
    backgroundColor: "#FFF8DB",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  textoCarregando: {
    color: "#24405E",
    marginTop: 14,
    fontSize: 15,
  },
  iconeErro: {
    fontSize: 44,
    marginBottom: 10,
  },
  tituloErro: {
    color: "#E3350D",
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 8,
  },
  textoErro: {
    color: "#52677A",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  cabecalho: {
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 14,
  },
  pokebola: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: "#1F1F1F",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 6,
    position: "relative",
  },
  pokebolaTopo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: "#E3350D",
  },
  pokebolaLinha: {
    position: "absolute",
    top: 23,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "#1F1F1F",
  },
  pokebolaCentro: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#1F1F1F",
    backgroundColor: "#FFFFFF",
    top: 18,
    left: 15,
  },
  titulo: {
    color: "#2A75BB",
    fontSize: 31,
    fontWeight: "900",
    textShadowColor: "#FFCB05",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  subtitulo: {
    color: "#52677A",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  cardDestaque: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1D66A",
    padding: 14,
    marginBottom: 14,
  },
  iconeDestaque: {
    fontSize: 28,
    marginRight: 10,
  },
  destaqueTexto: {
    flex: 1,
  },
  rotuloDestaque: {
    color: "#7A6A2C",
    fontSize: 12,
    fontWeight: "600",
  },
  nomeDestaque: {
    color: "#24405E",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 2,
  },
  valorDestaque: {
    color: "#E3350D",
    fontSize: 14,
    fontWeight: "800",
  },
  cardGrafico: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1D66A",
    paddingVertical: 16,
    marginBottom: 14,
    overflow: "hidden",
  },
  tituloGrafico: {
    color: "#24405E",
    fontSize: 20,
    fontWeight: "900",
    paddingHorizontal: 16,
  },
  descricaoGrafico: {
    color: "#6A7E8F",
    fontSize: 13,
    paddingHorizontal: 16,
    marginTop: 3,
    marginBottom: 6,
  },
  grafico: {
    marginTop: 8,
    borderRadius: 14,
  },
  resumoLinha: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  cardResumo: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1D66A",
    paddingVertical: 15,
    alignItems: "center",
  },
  numeroResumo: {
    color: "#2A75BB",
    fontSize: 24,
    fontWeight: "900",
  },
  rotuloResumo: {
    color: "#617587",
    fontSize: 12,
    marginTop: 3,
  },
  cardRanking: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1D66A",
    padding: 16,
  },
  tituloRanking: {
    color: "#24405E",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  posicao: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFCB05",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#D4A900",
  },
  posicaoTexto: {
    color: "#24405E",
    fontWeight: "900",
  },
  rankingConteudo: {
    flex: 1,
  },
  rankingTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  nomePokemon: {
    color: "#24405E",
    fontSize: 14,
    fontWeight: "700",
  },
  votosPokemon: {
    color: "#E3350D",
    fontSize: 13,
    fontWeight: "700",
  },
  barraFundo: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5EFF8",
    overflow: "hidden",
  },
  barraPreenchida: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2A75BB",
  },
  rodape: {
    color: "#718291",
    fontSize: 12,
    textAlign: "center",
    marginTop: 18,
  },
});
