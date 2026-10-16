# Elvira & Alexanders Bryllupsside (7. August 2027)

React + Vite bryllupsside med automatisk GitHub Actions build og FTP-deploy til `majkjaer.dk`.

## Ret indhold, program & ønskeseddel
Alt indhold er samlet i **[`src/config.js`](src/config.js)**:
- **Program**: Tilføj flere punkter i `program`-listen og sæt `programPending: false`, når programmet er helt på plads.
- **Ønskeseddel (automatisk fra Ønskeskyen)**: Indsæt ID'et fra deres Ønskesky-link i `wishlistId` (f.eks. fra `https://onskeskyen.dk/da/wishlists/1kIYd72DsHmEClaa` er ID'et `'1kIYd72DsHmEClaa'`). Så trækker siden selv ønsker, priser, billeder og direkte links ud automatisk.
- **Forside-billeder**: Læg billeder (`1.jpg`, `2.jpg`, osv.) i [`public/forside_billeder/`](public/forside_billeder/).

## GitHub Secrets (opsættes én gang på GitHub)
Gå til **Settings → Secrets and variables → Actions → New repository secret** på GitHub og opret:

| Secret navn | Beskrivelse / Værdi |
|---|---|
| `FTP_SERVER` | FTP-serveradresse til webhotellet (f.eks. `ftp.majkjaer.dk`) |
| `FTP_USERNAME` | FTP-brugernavn |
| `FTP_PASSWORD` | FTP-adgangskode |
| `FTP_DIR` | Mappe på FTP-serveren (f.eks. `./` eller `/public_html/`) |
| `DB_USER` | `majkjaer_bryllup` |
| `DB_PASSWORD` | *(Samme kode som i den gamle `db_config.php`)* |
| `DB_NAME` | `majkjaer_bryllup` |
| `ADMIN_PASSWORD` | Adgangskode til `#admin/`-panelet |
| `NOTIFY_EMAIL` | *(Valgfri)* Email der får besked ved nye kosthensyn (standard: `majkjaer_bryllup@outlook.dk`) |

## Tømning af gammel database
Når siden er deployet:
1. Gå ind på `https://majkjaer.dk/#admin/` og log ind, og klik **"Tøm database"** (bekræft med `SLET ALT`), **eller**
2. Kør GitHub Action manuelt under **Actions → Build & Deploy til Webhotel → Run workflow** og skriv `SLET ALT` i feltet.

*(Bemærk: De nye gæste-uploads gemmes i `/minder/` og forsidebilleder i `/forside_billeder/`, så der vises ingen gamle billeder fra `billeder/` eller `hero_images/`).*
