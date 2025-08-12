#include <stdlib.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

#define MAX_MESSAGE_SIZE 1024

char* read_file(const char* filename);
int run_server();

int main() {
  const char *account_status_request_json = "{\"MSG\": \"ACCOUNT_STATUS\"}";
  const char *trade_history_request_json = "{\"MSG\": \"TRADE_HISTORY\"}";

  const char *trade_history_file = "trade_history.json";
  char *trade_history_string = read_file(trade_history_file);

  const char *account_status_file = "account_status.json";
  char *account_status_string = read_file(account_status_file);

  if (trade_history_string == NULL) 
  {
    return 1;
  } 

  if (account_status_string == NULL) 
  {
    return 1;
  }

  // Create the socket
  int server_fd = socket(AF_INET, SOCK_STREAM, 0);

  // Specify ip and port
  struct sockaddr_in address;
  address.sin_family = AF_INET;
  address.sin_addr.s_addr = htonl(INADDR_ANY);
  address.sin_port = htons(8080);

  // Bind socket to an ip address
  int local_addr = bind(server_fd, (struct sockaddr*)&address, sizeof(address));
  if (local_addr == -1) 
  {
    perror("Failed to bind socket to ip address. \n");
    free(trade_history_string);
    free(account_status_string);
    return 1;
  }

  // Listen for incoming connections
  int listener = listen(server_fd, 3);
  if (listener) 
  {
    perror("Failed to listen for incoming connections. \n");
    free(trade_history_string);
    free(account_status_string);
    return 1;
  }

  printf("Socket server running on localhost port 8080 ... \n");

  while (1) {
    // Accept incoming connections
    int address_len = sizeof(address);
    int new_socket_fd = accept(server_fd, (struct sockaddr *)&address, (socklen_t *)&address_len);
    if (new_socket_fd < 0)
    {
      perror("Failed to accept connections.");
      free(trade_history_string);
      free(account_status_string);
      continue;
    }

    printf("Connection accepted. \n");

    // Data transfer
    char buffer[MAX_MESSAGE_SIZE] = {};
    int read_bytes = read(new_socket_fd, buffer, sizeof(buffer));
    if (read_bytes == -1) 
    {
      perror("Failed to read the socket. \n");
      free(trade_history_string);
      free(account_status_string);
      return 1;
    }

    // Split the client request token from the delimeter
    char *client_token, *str, *tofree;
    tofree = str = strdup(buffer);
    client_token = strsep(&str, "\r\n");

    // Decide what data to write to the new socket based on the request
    if (strcmp(client_token, account_status_request_json) == 0) 
    {
      printf("ACC: %s\n", buffer);
      int written_bytes = write(new_socket_fd, account_status_string, strlen(account_status_string));

      if (written_bytes == -1) 
      {
        perror("Failed to write to the socket.");
        free(trade_history_string);
        free(account_status_string);
        return 1;
      }

    }
    else if (strcmp(client_token, trade_history_request_json) == 0)
    {
      printf("TH: %s\n", buffer);
      int written_bytes = write(new_socket_fd, trade_history_string, strlen(trade_history_string));

      if (written_bytes == -1) 
      {
        perror("Failed to write to the new socket.");
        free(trade_history_string);
        free(account_status_string);
        return 1;
      }

    } 
    else 
    {
      char *no_match = "No match. \n";
      printf("%s", no_match);
      int written_bytes = write(new_socket_fd, no_match, strlen(no_match));

      if (written_bytes == -1) 
      {
        perror("Failed to write to new socket");
        free(trade_history_string);
        free(account_status_string);
        return 1;
      }

    }

    free(tofree);

    close(new_socket_fd);
    printf("Connection closed. \n");
  }
  close(server_fd);

  return 0;
}

// Read file to string buffer. Free after use.
char* read_file(const char* filename) 
{
  FILE *file = fopen(filename, "rb");

  if (file == NULL) 
  {
    perror("Error opening file");
    return NULL;
  }

  // Checking the size of the file to allocate memory for it
  fseek(file, 0, SEEK_END);
  long length = ftell(file);
  fseek(file, 0, SEEK_SET);


  // Plus 3 for delimeter and nul
  char *buffer = (char*)malloc(length + 3);
  if (buffer == NULL) {
    fprintf(stderr, "Failed to allocate memory for a file buffer. \n");
    fclose(file);
    return NULL;
  }

  char *delimeter = "\r\n";
  unsigned long read_stream = fread(buffer, 1, length, file);
  strcat(buffer, delimeter);
  buffer[length + strlen(delimeter)] = '\0';
  fclose(file);
  return buffer;
}
