{
  description = "A Nix-flake based Typescript development environment";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs";
  };

  outputs = {self, ...} @ inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import inputs.nixpkgs {
        localSystem = {inherit system;};
        overlays = [
          (final: prev: let
            # Should be 17, but seemingly that's a bit too old for nixpkgs
            nodeVersion = 18;
          in {
            nodejs = prev."nodejs_${builtins.toString nodeVersion}";
          })
        ];
      };
    in {
      checks = {
        # inherit # Comment in when you want tests to run on every new shell
        #   <nix derivation running builds/tests/lints/etc>
        #   ;
      };
      devShells.default = pkgs.mkShell {
        packages = with pkgs; [
          # project's code specific
          nodejs
          typescript

          # Editor stuffs
          helix
          (with nodePackages; [
            typescript-language-server
            vscode-langservers-extracted
          ])
        ];

        shellHook = ''
          ${pkgs.helix}/bin/hx --version
          ${pkgs.helix}/bin/hx --health typescript
          ${pkgs.nodejs}/bin/npm version
        '';
      };
      packages = {
        # docker = pkgs.dockerTools.buildImage {
        #   name = pname;
        #   tag = "v${cargo-details.package.version}";
        #   extraCommands = ''mkdir -p data'';
        #   config = {
        #     Cmd = "--help";
        #     Entrypoint = ["${cargo-package}/bin/${pname}"];
        #   };
        # };
      };
      # packages.default = cargo-package;

      formatter = pkgs.alejandra;
    });
}
