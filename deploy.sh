 #!/bin/bash 
rm -rf build/
npm run build
firebase deploy --only hosting:lk-stock-market

# To fix Failed to get Firebase project https://stackoverflow.com/a/68410138/7765316
# firebase login --reauth