export function normaliseSadhanaName(sadhana: string) {
  switch (sadhana) {
    case "Avalokiteshvara (1000 armed)":
    case "Avalokiteshvara (2 armed)":
    case "Avalokiteshvara (4 armed & 1000 armed)":
    case "Avalokiteshvara (4 armed)":
      return "Avalokiteshvara";
    case "Tara Green":
    case "Tara":
      return "Green Tara";
    case "Tara Golden":
      return "Golden Tara";
    case "Tara Red":
    case "Tara Red (Nyingma)":
      return "Red Tara";
    case "Tara White":
    case "White Tara with Pratitya Samutpada":
      return "White Tara";
    case "Manjughosha":
    case "Manjughosa stuti sadhana":
    case "Manjushri":
    case "Manjusri Manjugosha":
    case "Manjusri  Manjugosha":
    case "Maitrighosha Sadhana Stuti":
    case "Maitrighosha":
      return "Manjughosha/Manjushri";
    case "Padmsambhava":
      return "Padmasambhava";
    case "Six Elements":
    case "Six element practice":
    case "Six elements":
      return "Six Element Practice";
    case "Vajrapani":
    case "Vajrapani (Peaceful and Wrathful)":
    case "Vajrapani (Peaceful)":
    case "Vajrapani (Wrathful)":
      return "Vajrapani";
    case "Vajrasattva":
    case "Vajrasattva Padmasambhava":
        return "Vajrasattva";
    case "Vajrayogini (Dancing)":
      return "Vajrayogini";
    case "Acalaraja":
    case "Guru Yoga":
    case "Lam Rim":
    case "Prostration":
      return null;
    default:
      return sadhana;
  }
}