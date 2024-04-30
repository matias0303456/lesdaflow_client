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
export const OrderFilter = () => {
  const searchSelect = ["Cod. Pedido", "Fecha", "Proveedor"];

  const [searchItemToRender, setSearchItemToRender] = useState("");
  return (
    <Box className="w-[50%] px-2 py-3 flex items-center justify-end">
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
        className="w-[70%] h-12 flex gap-1 items-end justify-center"
        variant="standard"
      >
        <Typography
          variant="p"
          className="w-[10%] flex items-end justify-end text-sm text-gray"
        >
          Valor
        </Typography>
        <Box className="w-[80%]">
          {searchItemToRender === "Fecha" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl variant="standard" className="w-[50%]">
                <DatePicker
                  className="h-10"
                  label="Desde"
                  value={today}
                  defaultValue={today}
                  minDate={tomorrow}
                  views={["year", "month", "day"]}
                />
              </FormControl>
              <FormControl variant="standard" className="w-[50%]">
                <DatePicker
                  className="h-10"
                  label="Hasta"
                  value={tomorrow}
                  defaultValue={tomorrow}
                  minDate={tomorrow}
                  views={["year", "month", "day"]}
                />
              </FormControl>
            </LocalizationProvider>
          ) : searchItemToRender === "Cod. Pedido" ? (
            <Input type="number" placeholder="0" />
          ) : (
            searchItemToRender === "Proveedor" && <Input type="text" />
          )}
        </Box>
      </Box>
    </Box>
  );
};
