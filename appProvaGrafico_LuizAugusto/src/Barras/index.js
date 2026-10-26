import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const URL = 'http://localhost/LuizPHP/listardoces.php';

export default function Barras() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch(URL)
      .then((resp) => resp.json())
      .then((json) => setDados(json))
      .catch(() => setErro('Não foi possível carregar os dados do banco.'))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#3f64c7" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  const data = {
    labels: dados.map((item) => item.nomedoce),
    datasets: [{ data: dados.map((item) => Number(item.quantidade)) }],
  };

  const largura = Math.max(Dimensions.get('window').width - 20, 380);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Doceria</Text>

      <ScrollView horizontal>
        <BarChart
          data={data}
          width={largura}
          height={300}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.grafico}
        />
      </ScrollView>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(139, 69, 19, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.7,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  texto: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  grafico: {
    marginVertical: 8,
    borderRadius: 8,
  },
  erro: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
