import google.generativeai as genai

class Texts:
    # Constantes
    API_KEY = "AIzaSyC7QlRDfoF5Al7KQAiTGjJrAE79PdLgxT8"

    @staticmethod
    def chat_response(prompt):
        genai.configure(api_key=Texts.API_KEY)
        model = genai.GenerativeModel(model_name="gemini-pro")
        response = model.generate_content(prompt)
        return response.text


if __name__ == "__main__":
    print("Bienvenido al chat de IA. Escribe 'salir' para finalizar.")
    while True:
        user_input = input("Tú: ")
        if user_input.lower() == 'salir':
            print("Saliendo del chat...")
            break
        response = Texts.chat_response(user_input)  # Usamos el input del usuario directamente
        print("IA:", response)
