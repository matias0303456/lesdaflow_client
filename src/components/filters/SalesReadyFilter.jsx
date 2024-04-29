import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
//    date data
const today = dayjs();
const tomorrow = dayjs().add(1, "day");
export const SalesReadyFilter = () => {
  const searchSelect = [
    "Fecha Venta",
    "Cod. Venta",
    "Cliente",
    "Venta Tipo Comprobante",
  ];

  const [searchItemToRender, setSearchItemToRender] = useState("");

  return (
    <Box className="w-[40%] px-2 py-3 flex items-center justify-end">
      <FormControl className="w-[30%]" variant="standard">
        <InputLabel htmlFor="last_name">Buscar en </InputLabel>
        <Select type="underline" value={searchItemToRender}>
          {searchSelect.map((searchItem) => (
            <MenuItem
              key={searchItem}
              onClick={() => setSearchItemToRender(searchItem)}
            >
              {searchItem}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        className="w-[70%] h-12 flex gap-2 items-end justify-center"
        variant="standard"
      >
        <Typography
          variant="p"
          className="w-[30%] flex items-end justify-end text-sm text-gray"
        >
          Valor
        </Typography>
        <Box className="w-[60%]">
          {searchItemToRender === "Fecha Venta" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl variant="standard" className="w-[100%]">
                <DatePicker
                  className="h-10"
                  defaultValue={today}
                  minDate={tomorrow}
                  views={["year", "month", "day"]}
                />
              </FormControl>
            </LocalizationProvider>
          ) : searchItemToRender === "Cod. Venta" ? (
            <Input type="number" placeholder="0" />
          ) : searchItemToRender === "Cliente" ? (
            <Input type="text" />
          ) : (
            searchItemToRender === "Venta Tipo Comprobante" && (
              <Input type="text" />
            )
          )}
        </Box>
      </Box>
    </Box>
  );
};
