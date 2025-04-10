{
  description = "GradeMark is a modern study platform";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs =
    { self, nixpkgs }@inputs:
    let
      system = "x86_64-linux";
    in
    {
      devShells."${system}".default =
        let
          pkgs = import nixpkgs {
            inherit system;
          };
        in
        pkgs.mkShell {
          packages = with pkgs; [
            nodejs_23
            nodePackages.pnpm
            postgresql
          ];
          shellHook = ''
            echo "node `${pkgs.nodejs_23}/bin/node --version`"
            export SHELL=${nixpkgs.lib.getExe pkgs.bash}
            export PGDATA=$PWD/.pgdata
            export PGHOST=$PGDATA  # So psql knows where the socket is

            if [ ! -d "$PGDATA" ]; then
              echo "Initializing local PostgreSQL database..."
              initdb -D "$PGDATA"
            fi

            echo "Starting PostgreSQL in the background..."
            pg_ctl -D "$PGDATA" \
                   -l "$PGDATA/logfile" \
                   -o "-k $PGDATA" \
                   start

            echo "To stop the server, run: pg_ctl -D \"$PGDATA\" stop"
          '';
        };
    };
}
