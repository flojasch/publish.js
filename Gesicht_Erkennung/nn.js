
function sigmoid(x){
    return 1/(1+Math.exp(-x));
}
function dsigmoid(y){
    return y*(1-y);
}

class NeuralNetwork {

  constructor(input_nodes, hidden_nodes, output_nodes,learning_rate) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;
    this.learning_rate = learning_rate;
    this.weights_ih = new Matrix(this.hidden_nodes,this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes,this.hidden_nodes);
    this.weights_ih.randomize();
    this.weights_ho.randomize();
    this.bias_h = new Matrix(this.hidden_nodes,1);
    this.bias_o = new Matrix(this.output_nodes,1);
    this.bias_h.randomize();
    this.bias_o.randomize();
  }

predict(input_array){
    //generating the hidden output
    let inputs = Matrix.fromArray(input_array); 
    let hidden = Matrix.multiply(this.weights_ih,inputs);
    
    hidden.add(this.bias_h);
    //activation function!
    hidden.map(sigmoid);
    let output = Matrix.multiply(this.weights_ho,hidden);
    output.add(this.bias_o);
    output.map(sigmoid);
    return output.toArray();
}
train(input_array,target_array){
    let inputs = Matrix.fromArray(input_array); 
    let hidden = Matrix.multiply(this.weights_ih,inputs);
    
    hidden.add(this.bias_h);
    //activation function!
    hidden.map(sigmoid);
    let output = Matrix.multiply(this.weights_ho,hidden);
    output.add(this.bias_o);
    output.map(sigmoid);
    
    let target=Matrix.fromArray(target_array);
    
    let output_error = Matrix.subtract(target,output);
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_error = Matrix.multiply(who_t,output_error);
  
    //calculate delta weights between hidden layer and output
    let gradient = Matrix.map(output,dsigmoid);
    gradient.multiply(output_error);
    gradient.multiply(this.learning_rate);
    
    let hidden_t = Matrix.transpose(hidden);
    let weight_ho_deltas = Matrix.multiply(gradient,hidden_t);
    this.weights_ho.add(weight_ho_deltas);
    this.bias_o.add(gradient);
    //calculate delta weights between input layer and hidden layer
    
    let hidden_gradient = Matrix.map(hidden,dsigmoid);
    hidden_gradient.multiply(hidden_error);
    hidden_gradient.multiply(this.learning_rate);
    
    let input_t = Matrix.transpose(inputs);
    let weight_ih_delta = Matrix.multiply(hidden_gradient,input_t);
    this.weights_ih.add(weight_ih_delta);
    this.bias_h.add(hidden_gradient);
    
    
}

}
