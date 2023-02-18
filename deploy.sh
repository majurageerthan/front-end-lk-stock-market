 #!/bin/bash 
rm -rf build/
npm run build
firebase deploy --only hosting:lk-stock-market