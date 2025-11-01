import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Switch, FlatList } from 'react-native';


const getBMICategory = (bmi) => {
  const bmiValue = parseFloat(bmi);
  if (bmiValue < 18.5) return 'Underweight';
  if (bmiValue < 25) return 'Normal Weight';
  if (bmiValue < 30) return 'Overweight';
  return 'Obese';
};

const getBMIColor = (bmi) => {
  const bmiValue = parseFloat(bmi);
  if (bmiValue < 18.5) return '#3498DB'; 
  if (bmiValue < 25) return '#2ECC71'; 
  if (bmiValue < 30) return '#F39C12'; 
  return '#E74C3C';
};

export default function App() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [isMetric, setIsMetric] = useState(true); // true = metric, false = imperial
  const [history, setHistory] = useState([]);

  const calculateBMI = () => {
    let heightNum = parseFloat(height);
    let weightNum = parseFloat(weight);

    if (!height || !weight) {
      alert('Ju lutem shenoni peshen dhe gjatesine');
      return;
    }
    if (heightNum <= 0 || weightNum <= 0) {
      alert('Ju lutem shenoni vlerat e sakta pozitive');
      return;
    }

    // Convert if imperial
    if (!isMetric) {
      // weight in lb to kg, height in in to m
      weightNum = weightNum * 0.453592;
      heightNum = heightNum * 0.0254;
    } else {
      // metric: cm to m
      heightNum = heightNum / 100;
    }

    const bmiValue = weightNum / (heightNum * heightNum);
    const roundedBMI = bmiValue.toFixed(1);
    setBmi(roundedBMI);

    // Add to history
    const unit = isMetric ? 'kg/cm' : 'lb/in';
    setHistory(prev => [{ bmi: roundedBMI, unit, height, weight }, ...prev]);
  };

  const clearInputs = () => {
    setHeight('');
    setWeight('');
    setBmi('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BMI Calculator!</Text>

      {/* Units Toggle */}
      <View style={styles.switchContainer}>
        <Text style={{ color: '#fff', marginRight: 10 }}>Metric</Text>
        <Switch
          value={!isMetric}
          onValueChange={() => setIsMetric(prev => !prev)}
        />
        <Text style={{ color: '#fff', marginLeft: 10 }}>Imperial</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Height {isMetric ? '(cm)' : '(in)'}</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          placeholder='Enter height'
          placeholderTextColor="#999"
          keyboardType='numeric'
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight {isMetric ? '(kg)' : '(lb)'}</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder='Enter weight'
          placeholderTextColor="#999"
          keyboardType='numeric'
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearInputs}>
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>

      {bmi ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Your BMI:</Text>
          <Text style={styles.resultValue}>{bmi}</Text>

          <View style={[styles.categoryBadge, { backgroundColor: getBMIColor(bmi) }]}>
            <Text style={styles.categoryText}>{getBMICategory(bmi)}</Text>
          </View>

          <View style={styles.guideContainer}>
            <Text style={styles.guideTitle}>BMI Reference:</Text>
            <Text style={styles.guideText}>Below 18.5: Underweight</Text>
            <Text style={styles.guideText}>18.5 - 24.9: Normal Weight</Text>
            <Text style={styles.guideText}>25.0 - 29.9: Overweight</Text>
            <Text style={styles.guideText}>30.0+: Obese</Text>
          </View>
        </View>
      ) : null}

      {/* BMI History */}
      {history.length > 0 && (
        <View style={{ marginTop: 20, width: '100%' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10 }}>BMI History:</Text>
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>
                  {index + 1}. BMI: {item.bmi} ({item.unit}) | H: {item.height} | W: {item.weight}
                </Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#482323',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#ecbebe'
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#af4b4b'
  },
  input: {
    backgroundColor: '#e48484',
    borderWidth: 1,
    borderColor: '#c8a7a7',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    color: '#000'
  },
  button: {
    backgroundColor: '#eae1e1',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%'
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000'
  },
  clearButton: {
    backgroundColor: '#95A5A6',
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%'
  },
  resultLabel: {
    fontSize: 18,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  categoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guideContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2C3E50'
  },
  guideText: {
    fontSize: 16,
    color: '#34495E'
  },
  historyItem: {
    backgroundColor: '#eae1e1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5
  },
  historyText: {
    fontSize: 16,
    color: '#2C3E50'
  }
});