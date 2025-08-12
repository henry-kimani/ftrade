let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-unstable";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in

  pkgs.mkShellNoCC {
    packages = with pkgs; [ 
      valgrind
      netcat-gnu
      supabase-cli
      podman-compose
      cowsay
      lolcat
    ];

    buildInputs = with pkgs; [
      # 15.8.1.069
      postgresql
    ];

    # Using podman instead of docker
    DOCKER_HOST="unix:///run/user/1000/podman/podman.sock";

    shellHook = ''

      printf " 
        FTrade Project Entered 
        To connect with psql, run
        psql -h localhost -U postgres -p 'port'
      " | cowsay | lolcat

      zsh # To enter zsh after completing instead of bash
    '';
  }
