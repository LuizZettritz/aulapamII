import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const URL = 'http://localhost/LuizPHP/listarpokemon.php';

const cores = ['#f4c430', '#e3350d', '#2a75bb', '#4caf50'];

export default function Setores() {
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

  const data = dados.map((item, i) => ({
    name: item.nomepokemon,
    population: Number(item.numeropokedex),
    color: cores[i % cores.length],
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Registro da Pokedex</Text>

      <PieChart
        data={data}
        width={Dimensions.get('window').width - 20}
        height={230}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </ScrollView>
  );
}

const chartConfig = {
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
  erro: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
