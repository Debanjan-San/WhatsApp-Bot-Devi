{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.neofetch
    pkgs.libwebp
    pkgs.imagemagick
    pkgs.speedtest-cli
    pkgs.jellyfin-ffmpeg
    pkgs.git
    pkgs.libuuid
    pkgs.python311Packages.python
    pkgs.nodePackages.pm2
    pkgs.wget
  ];

  env = {
    LD_LIBRARY_PATH = "${pkgs.lib.makeLibraryPath [pkgs.libuuid]}";
  };
}