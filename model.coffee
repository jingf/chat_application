simport Sunny.Dsl
simport Sunny.Types

# =================================
# move to std lib
# =================================

record class AuthUser
  name: Text
  email: Text
  password: Text

machine class WebClient
  auth_token: Text

machine class WebServer
  online_clients: set WebClient

# ================================




record class User extends AuthUser
  status: Text

record class Msg
  text: Text
  sender: User

record class ChatRoom
  name: Text
  members: set User
  messages: set Msg

# -------------------------------

machine class Client extends WebClient
  user: User

machine class Server
  rooms: set ChatRoom