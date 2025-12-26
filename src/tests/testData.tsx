import {
  DataResponse,
  OrderMember,
  OrdinationLocation,
  TableRowData,
} from "../utilities/types";

export const orderMembers: Record<string, OrderMember> = {
  dhammakumara: {
    name: "Dhammakumāra",
    gender: "Male",
    status: "Active",
    area: "Oceania",
    ordainedDate: "2017-09-30",
    ordainedLocation: "Padmaloka",
    privatePreceptor: "srikirti",
    publicPreceptor: "maitreyabandhu",
    meaning: "Prince of the Dhamma",
    diedDate: undefined,
    resignedDate: undefined,
    image: "dhammakumara.jpg",
  },
  maitreyabandhu: {
    name: "Maitreyabandhu",
    gender: "Male",
    status: "Active",
    area: "UK&Ireland",
    ordainedDate: "1990-06-08",
    ordainedLocation: "Padmaloka",
    privatePreceptor: "suvajra",
    publicPreceptor: "subhuti",
    meaning: "Friendly brother",
    diedDate: undefined,
    resignedDate: undefined,
    image: "maitreyabandhu.jpg",
  },
  srikirti: {
    name: "Śrīkīrtī",
    gender: "Male",
    status: "Active",
    area: "UK&Ireland",
    ordainedDate: "2003-07-10",
    ordainedLocation: "Padmaloka",
    privatePreceptor: "ashvajit",
    publicPreceptor: "surata",
    meaning: "Auspicious fame or reputation",
    diedDate: undefined,
    resignedDate: undefined,
    image: "srikirti.jpg",
  },
};

export const orderMemberRows: TableRowData[] = [
  {
    key: "dhammakumara",
    link: "/order-members/dhammakumara",
    image: "/photos/Dhammakumara.jpg",
    title: "Dhammakumāra",
    description: <>30 September 2017</>,
    date: new Date("2017-09-30"),
    badge: null,
    bubble: [],
    filterValues: {
      area: ["Oceania"],
      gender: ["Male"],
      preceptors: [],
      status: ["Active"],
    },
  },
  {
    key: "srikirti",
    link: "/order-members/srikirti",
    image: "/photos/Srikirti.jpg",
    title: "Śrīkīrtī",
    description: <>10 July 2003</>,
    date: new Date("2003-07-10"),
    badge: null,
    bubble: [4],
    filterValues: {
      area: ["UK&Ireland"],
      gender: ["Male"],
      preceptors: ["private"],
      status: ["Active"],
    },
  },
  {
    key: "maitreyabandhu",
    link: "/order-members/maitreyabandhu",
    image: "/photos/Maitreyabandhu.jpg",
    title: "Maitreyabandhu",
    description: <>8 June 1990</>,
    date: new Date("1990-06-08"),
    badge: null,
    bubble: [25, 29],
    filterValues: {
      area: ["UK&Ireland"],
      gender: ["Male"],
      preceptors: ["private", "public"],
      status: ["Active"],
    },
  },
];

export const locations: Record<string, OrdinationLocation> = {
  padmaloka: {
    name: "Padmaloka Retreat Centre",
  },
};

export const dataFromServer: DataResponse = {
  orderMembers: orderMembers,
  locations: locations,
};
