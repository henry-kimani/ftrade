{
  description = "A nix flake for Ftrade";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  output = { nixpkgs, ... }:
    let
      system = "x86_64-linux";  
      pkgs = nixpkgs.legacyPackages.${system};
    in {

      devShells.${system}.dev = (import ./shell.nix { inherit pkgs; });

    };
}
