# # # sample input feature 
# #     # just test -> python predict.py and then type this feature 
# # # 40.900749	0.818182	95.4	0	95.4	0	0.166667	0	0.083333	0	0	2	1000	201.802084	139.509787	0	12


import sys
import pickle
import json

def load_model(model_path):
    with open(model_path, 'rb') as file:
        return pickle.load(file)

def predict(features):
    model = load_model('final_model.pkl')
    prediction = model.predict([features])
    return prediction.tolist()

if __name__ == '__main__':
    features = [float(x) for x in sys.argv[1:]]
    prediction = predict(features)
    # print(prediction)
    print(json.dumps(prediction))


# # import sys

# print("Prediction result: 1")


