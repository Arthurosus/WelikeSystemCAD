import { useQuery } from "@tanstack/react-query";
import { CompanyService } from "../services/companyService";

export const useCompanies = (skip, limit) => {
    return useQuery({
        queryKey: ["companies", skip, limit],
        queryFn: () => CompanyService.list(skip, limit),
        keepPreviousData: true,
    });
};
