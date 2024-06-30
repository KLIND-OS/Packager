export default function getContentInstall({
  nodejsLibraries,
  linuxPrograms,
  appname,
}) {
  return `
(async () => {
  const execAsync = LowLevelApi.filesystem.promisify(
    LowLevelApi.child_process.exec,
  );

  control.notify("${appname}", "Začínám instalaci!");
  windows.open("viewtext", {
    text: "Instalace programu ${appname}\\n\\nPrávě se začala instalovat aplikace ${appname}.\\n\\nProsím počkejte...",
    title: "Status instalace programu",
  });

  await execAsync("sudo pacman -Sy --noconfirm --needed ${linuxPrograms}")

  await LowLevelApi.NodePackages.install("${nodejsLibraries}")

  windows.open("viewtext", {
    text: "Instalace programu ${appname} byla dokončena!\\n\\nZa několik sekund se vám restartuje počítač.",
    title: "Status instalace programu"
  })

  setTimeout(() => {
    // Finish installation
    window.installFinished();
  }, 5000)
})();
`.trim();
}
