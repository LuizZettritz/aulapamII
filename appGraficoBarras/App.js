import {useState,useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

export default function App() {
  const[dados,setDados] = useState([]);
  const[loading,setLoading] = useState(true);

    useEffect(() => {
    fetch("http://localhost/aulaPAMII/graficos/geragraficos.php") 
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
  const total = valores.reduce((acc, val) => acc + val,0 );
  const cores = ["#b21414ff", "#3489db", "#2ece17", "#9b59b6", "#f15c0f"]


  return (
     <ScrollView style={styles.container}>
      <BarChart
      data={{
        labels: nomes,
        datasets: [{data: valores}]
      }}
      width = {Dimensions.get("window").width - 20}
      height = {220}
      fromZero
      chartConfig={chartConfig}
      style={styles.grafico}
      >

      </BarChart>

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
  backgroundColor: "#4ea3a3ff",
  backgroundGradientFrom: "#5e5e5eff",
  backgroundGradientTo: "rgba(71, 127, 177, 0.87)",

  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`,
  propsForDots: {
    r: "6",
    strokeWidth: "3",
    stroke: "#ffa726",
  },
}


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