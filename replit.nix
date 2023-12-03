{ pkgs }: {
    deps = [
        pkgs.nixos-rebuild 
        pkgs.yarn
        pkgs.nodejs-18_x
        pkgs.libwebp
        pkgs.nodePackages.typescript
        pkgs.libuuid
        pkgs.ffmpeg
        pkgs.imagemagick  
        pkgs.wget
        pkgs.git
        pkgs.nodePackages.pm2
    ];
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];
  };
}