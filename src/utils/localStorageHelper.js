const PINNED_COMPANIES = 'PINNED_COMPANIES';

export const getPinnedCompanyIds = () => JSON.parse(localStorage.getItem(PINNED_COMPANIES) || '[]');

export const savePinnedCompanyId = (companyId) => {
  const savedCompanyIds = getPinnedCompanyIds();
  localStorage.setItem(PINNED_COMPANIES, JSON.stringify([...savedCompanyIds, companyId]));
};

export const removePinnedCompanyId = (companyId) => {
  const savedCompanyIds = getPinnedCompanyIds();
  const arr = savedCompanyIds.filter((item) => item !== companyId);
  localStorage.setItem(PINNED_COMPANIES, JSON.stringify(arr));
};
