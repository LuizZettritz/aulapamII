
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const STORAGE_KEY = "@gamestudy_tasks";

const COLORS = {
  background: "#080D19",
  card: "#111A2B",
  cardLight: "#18243A",
  primary: "#55F2D0",
  purple: "#9B6DFF",
  blue: "#4D8DFF",
  white: "#F4F7FF",
  gray: "#8D9AB5",
  red: "#FF5F7A",
  yellow: "#FFD166",
  border: "#26344D",
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("Média");
  const [filter, setFilter] = useState("Todas");

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  async function loadTasks() {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log("Erro ao carregar tarefas:", error);
    }
  }

  async function saveTasks() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.log("Erro ao salvar tarefas:", error);
    }
  }

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const xp = completedTasks * 100;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const progress = xpInLevel / 500;

  function addTask() {
    if (!taskTitle.trim()) {
      Alert.alert("Missão sem nome", "Digite o nome da sua missão!");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      priority: selectedPriority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);

    setTaskTitle("");
    setTaskDescription("");
    setSelectedPriority("Média");
    setModalVisible(false);
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    Alert.alert(
      "Excluir missão",
      "Tem certeza de que deseja excluir esta missão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            setTasks((currentTasks) =>
              currentTasks.filter((task) => task.id !== id)
            ),
        },
      ]
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pendentes") return !task.completed;
    if (filter === "Concluídas") return task.completed;
    return true;
  });

  function getPriorityColor(priority) {
    if (priority === "Alta") return COLORS.red;
    if (priority === "Baixa") return COLORS.primary;
    return COLORS.yellow;
  }

  function renderTask({ item }) {
    return (
      <View style={[styles.taskCard, item.completed && styles.completedCard]}>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => toggleTask(item.id)}
        >
          <Ionicons
            name={item.completed ? "checkmark-circle" : "ellipse-outline"}
            size={27}
            color={item.completed ? COLORS.primary : COLORS.gray}
          />
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskTitle,
              item.completed && styles.completedText,
            ]}
          >
            {item.title}
          </Text>

          {!!item.description && (
            <Text style={styles.taskDescription}>
              {item.description}
            </Text>
          )}

          <View style={styles.taskFooter}>
            <View
              style={[
                styles.priorityBadge,
                { borderColor: getPriorityColor(item.priority) },
              ]}
            >
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: getPriorityColor(item.priority) },
                ]}
              />
              <Text
                style={[
                  styles.priorityText,
                  { color: getPriorityColor(item.priority) },
                ]}
              >
                {item.priority}
              </Text>
            </View>

            {item.completed && (
              <Text style={styles.xpReward}>+100 XP</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(item.id)}
        >
          <Ionicons name="trash-outline" size={19} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallLabel}>PLAYER 01</Text>
            <Text style={styles.logo}>
              GAME<Text style={styles.logoAccent}>STUDY</Text>
            </Text>
          </View>

          <View style={styles.avatar}>
            <Ionicons name="game-controller" size={27} color={COLORS.primary} />
          </View>
        </View>

        {/* PAINEL DO JOGADOR */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>SEU PROGRESSO</Text>
              <Text style={styles.heroTitle}>Continue evoluindo!</Text>
              <Text style={styles.heroSubtitle}>
                Complete missões e ganhe XP.
              </Text>
            </View>

            <View style={styles.levelCircle}>
              <Ionicons name="trophy" size={23} color={COLORS.yellow} />
              <Text style={styles.levelNumber}>{level}</Text>
              <Text style={styles.levelLabel}>LEVEL</Text>
            </View>
          </View>

          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>EXPERIÊNCIA</Text>
            <Text style={styles.xpValue}>
              {xpInLevel} / 500 XP
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>

          <View style={styles.heroBottom}>
            <View style={styles.xpIcon}>
              <Ionicons name="flash" size={17} color={COLORS.primary} />
            </View>
            <Text style={styles.totalXp}>{xp} XP acumulados</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.rankText}>RANK C</Text>
          </View>
        </View>

        {/* ESTATÍSTICAS */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#163D38" }]}>
              <Ionicons name="checkmark-done" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Concluídas</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#39264D" }]}>
              <Ionicons name="game-controller" size={22} color={COLORS.purple} />
            </View>
            <Text style={styles.statNumber}>{pendingTasks}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#20365A" }]}>
              <Ionicons name="flash" size={22} color={COLORS.blue} />
            </View>
            <Text style={styles.statNumber}>{xp}</Text>
            <Text style={styles.statLabel}>XP total</Text>
          </View>
        </View>

        {/* MISSÕES */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>CENTRAL DE COMANDO</Text>
            <Text style={styles.sectionTitle}>Minhas missões</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={25} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        {/* FILTROS */}
        <View style={styles.filters}>
          {["Todas", "Pendentes", "Concluídas"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterButton,
                filter === option && styles.activeFilter,
              ]}
              onPress={() => setFilter(option)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === option && styles.activeFilterText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LISTA DE MISSÕES */}
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="game-controller-outline"
                size={38}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma missão encontrada</Text>
            <Text style={styles.emptySubtitle}>
              Adicione uma missão e comece sua jornada!
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.emptyButtonText}>CRIAR MISSÃO</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.taskList}
          />
        )}

        {/* RODAPÉ */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
          <Text style={styles.footerText}>
            UM PASSO DE CADA VEZ. UMA FASE DE CADA VEZ.
          </Text>
        </View>
      </ScrollView>

      {/* MODAL PARA CRIAR MISSÃO */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>NOVA QUEST</Text>
                <Text style={styles.modalTitle}>Criar missão</Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>NOME DA MISSÃO</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Estudar programação"
              placeholderTextColor={COLORS.gray}
              value={taskTitle}
              onChangeText={setTaskTitle}
              maxLength={80}
            />

            <Text style={styles.inputLabel}>DESCRIÇÃO (OPCIONAL)</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Adicione os detalhes da missão..."
              placeholderTextColor={COLORS.gray}
              value={taskDescription}
              onChangeText={setTaskDescription}
              multiline
            />

            <Text style={styles.inputLabel}>NÍVEL DE PRIORIDADE</Text>
            <View style={styles.priorityOptions}>
              {["Baixa", "Média", "Alta"].map((priority) => {
                const color = getPriorityColor(priority);

                return (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      selectedPriority === priority && {
                        borderColor: color,
                        backgroundColor: `${color}18`,
                      },
                    ]}
                    onPress={() => setSelectedPriority(priority)}
                  >
                    <View
                      style={[styles.priorityDot, { backgroundColor: color }]}
                    />
                    <Text style={[styles.priorityOptionText, { color }]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.createButton} onPress={addTask}>
              <Ionicons name="flash" size={20} color={COLORS.background} />
              <Text style={styles.createButtonText}>INICIAR MISSÃO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  smallLabel: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 4,
  },

  logo: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
  },

  logoAccent: {
    color: COLORS.primary,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#142A35",
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#294052",
    padding: 19,
    marginBottom: 18,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroLabel: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 7,
  },

  heroSubtitle: {
    color: COLORS.gray,
    fontSize: 12,
  },

  levelCircle: {
    width: 75,
    height: 85,
    backgroundColor: "#29253C",
    borderColor: COLORS.purple,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  levelNumber: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "900",
  },

  levelLabel: {
    color: COLORS.purple,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 9,
  },

  xpLabel: {
    color: COLORS.gray,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  xpValue: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
  },

  progressBackground: {
    height: 8,
    backgroundColor: "#263248",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  heroBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  xpIcon: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#193A3A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  totalXp: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  rankText: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 29,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    minHeight: 125,
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  statNumber: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "900",
  },

  statLabel: {
    color: COLORS.gray,
    fontSize: 10,
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
  },

  sectionEyebrow: {
    color: COLORS.purple,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 6,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "900",
  },

  addButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  filterButton: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 11,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  activeFilter: {
    backgroundColor: "#173B3A",
    borderColor: COLORS.primary,
  },

  filterText: {
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: "700",
  },

  activeFilterText: {
    color: COLORS.primary,
  },

  taskList: {
    gap: 11,
  },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 13,
    gap: 10,
  },

  completedCard: {
    borderColor: "#28564F",
    backgroundColor: "#0E201F",
  },

  checkButton: {
    padding: 2,
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },

  completedText: {
    color: COLORS.gray,
    textDecorationLine: "line-through",
  },

  taskDescription: {
    color: COLORS.gray,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 9,
  },

  taskFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  priorityText: {
    fontSize: 9,
    fontWeight: "800",
  },

  xpReward: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "900",
  },

  deleteButton: {
    padding: 7,
  },

  emptyState: {
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 25,
  },

  emptyIcon: {
    width: 75,
    height: 75,
    borderRadius: 24,
    backgroundColor: "#17312F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  emptySubtitle: {
    color: COLORS.gray,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
  },

  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 11,
    marginTop: 18,
  },

  emptyButtonText: {
    color: COLORS.background,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 28,
    marginBottom: 10,
  },

  footerText: {
    color: COLORS.gray,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 35,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  modalEyebrow: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 5,
  },

  modalTitle: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "900",
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.cardLight,
    alignItems: "center",
    justifyContent: "center",
  },

  inputLabel: {
    color: COLORS.gray,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginBottom: 9,
    marginTop: 7,
  },

  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: COLORS.white,
    fontSize: 13,
    marginBottom: 13,
  },

  descriptionInput: {
    height: 85,
    textAlignVertical: "top",
  },

  priorityOptions: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 23,
  },

  priorityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  priorityOptionText: {
    fontSize: 11,
    fontWeight: "800",
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 13,
    paddingVertical: 16,
  },

  createButtonText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
