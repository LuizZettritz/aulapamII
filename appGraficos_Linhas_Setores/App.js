import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { BarChart, LineChart, PieChart} from "react-native-chart-kit";

//ATENÇÃO INSTALE A BIBLIOTECA

//npx expo install react-native-chart-kit react-native-svg


export default function App() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://10.67.57.113/aulaPAMII/graficos/geragraficos.php") 
      .then((res) => res.json())
      .then((json) => {
        setDados(json);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  const nomes = dados.map((item) => item.nome);
  const valores = dados.map((item) => parseInt(item.quantidade));
  const total = valores.reduce((acc, val) => acc + val, 0);

  const cores = ["#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#f1c40f"];


    const pieData = dados.map((item, i) => ({
    name: item.nome,
    population: parseInt(item.quantidade),
    color: cores[i % cores.length],
    legendFontColor: "#333",
    legendFontSize: 14,
  }));




  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>📊 Gráfico de Produtos</Text>

      {/* Gráfico de Barras */}
      <Text style={styles.subtitulo}>Gráfico de Barras</Text>
      <BarChart
        data={{
          labels: nomes,
          datasets: [{ data: valores }],
        }}
        width={Dimensions.get("window").width - 20}
        height={220}
        fromZero
        chartConfig={chartConfig}
        style={styles.grafico}
      />


            {/* Gráfico de Pizza */}
      <Text style={styles.subtitulo}>Gráfico de Pizza</Text>
      <PieChart
        data={pieData.map((item) => ({
          name: item.name,
          population: item.population,
          color: item.color,
          legendFontColor: item.legendFontColor,
          legendFontSize: item.legendFontSize,
        }))}
        width={Dimensions.get("window").width - 20}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        style={{ marginVertical: 10, borderRadius: 16 }}
      />


            {/* Gráfico de Linhas */}
      <Text style={styles.subtitulo}>Gráfico de Linhas</Text>
      <LineChart
        data={{
          labels: nomes,
          datasets: [{ data: valores }],
        }}
        width={Dimensions.get("window").width - 20}
        height={220}
        chartConfig={chartConfig}
        style={styles.grafico}
      />
      

      {/* Legenda  com % */}
      <View style={styles.legenda}>
        {dados.map((item, i) => (
          <View key={i} style={styles.legendaItem}>
            <View style={[styles.caixaCor, { backgroundColor: cores[i % cores.length] }]} />
            <Text style={styles.legendaTexto}>
              {item.nome}: {item.quantidade} ({((item.quantidade / total) * 100).toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: "#ffa726",
  backgroundGradientFrom: "#08130D",
  backgroundGradientTo: "#1F5D",

  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`,
  propsForDots: {
    r: "6",
    strokeWidth: "3",
    stroke: "#ffa726",
  },
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
     backgroundColor: "#fff" 
    },
  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  titulo: 
  { fontSize: 22,
    fontWeight: "bold", 
    textAlign: "center",
     marginVertical: 15 
    },
  subtitulo: 
  { fontSize: 18, 
    fontWeight: "600",
     marginLeft: 15,
     marginTop: 10
   },
  grafico: { 
    marginVertical: 10,
     borderRadius: 16, 
     alignSelf: "center" 
    },
  legenda:
   { marginTop: 10, 
    paddingHorizontal: 20,
     marginBottom: 20
     },
  legendaItem: 
  { flexDirection: "row",
     alignItems: "center",
     marginBottom: 6 
    },
  caixaCor:  { 
    width: 18, 
    height: 18, 
    marginRight: 8,
     borderRadius: 4 
    },
  legendaTexto: {
     fontSize: 14, 
     color: "#333"
     },
});
