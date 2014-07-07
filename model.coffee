simport Sunny.Dsl

# =================================
# move to std lib
# =================================

record class AuthUser
  name: "String"
  email: "String"
  password: "String"

machine class WebClient
  auth_token: "String"

machine class WebServer
  online_clients: set WebClient

# ================================




record class User extends AuthUser
  status: "String"

record class Msg
  text: "String"
  sender: User

record class ChatRoom
  name: "String"
  members: set User
  messages: set Msg

# -------------------------------

machine class Client extends WebClient
  user: User

machine class Server
  rooms: set ChatRoom