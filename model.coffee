simport Sunny.Dsl
simport Sunny.Types

# =================================
# move to std lib
# =================================

record class AuthUser extends Record
  name: Text
  email: Text
  password: Text

machine class WebClient extends Machine
  auth_token: Text

machine class WebServer extends Machine
  online_clients: set WebClient

# ================================




record class User extends AuthUser
  status: Text

record class Msg extends Record
  text: Text
  sender: User

record class ChatRoom extends Record
  name: Text
  members: set User
  messages: set Msg

# -------------------------------

machine class Client extends WebClient
  user: User

machine class Server extends WebServer
  rooms: set ChatRoom

