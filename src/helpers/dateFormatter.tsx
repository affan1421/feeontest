export const dateFormatter = (
  date: Date | string,
  options?: { format?: "dd-mm-yyyy" | "yyyy-mm-dd" | "mm-dd-yyyy"; devider?: "/" | "-" }
) => {
  const finalDate = new Date(date) || new Date();
  let formats = options?.format || "dd-mm-yyyy";
  let output: string[] = [];
  formats.split("-").forEach((format) => {
    if (format?.toLowerCase() == "yyyy") output.push(String(finalDate.getFullYear() || 0).padStart(4, "0"));
    if (format?.toLowerCase() == "mm") output.push(String(finalDate.getMonth() + 1 || 0).padStart(2, "0"));
    if (format?.toLowerCase() == "dd") output.push(String(finalDate.getDate() || 0).padStart(2, "0"));
  });
  return output.join(options?.devider || "-");
};
