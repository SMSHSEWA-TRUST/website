import {ContactUS, ContactUSPayload} from "@/services/contact.service";
import {useMutation} from "@tanstack/react-query";

export const QueryKeys = {
  contact: "contact",
  contactUS: ["contact", "contactUS"],
};

export const useContactUSForm = () =>
  useMutation({
    mutationKey: QueryKeys.contactUS,
    mutationFn: (payload: ContactUSPayload) => ContactUS(payload),
  });
