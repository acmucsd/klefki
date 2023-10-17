type StandardResponse = {
  message: string;
};

type ErrorResponse = {
  error: string;
};

type Data = StandardResponse | ErrorResponse;

interface EventDetails {
  title: string;
  community: string;
  location: string;
  description: string;
  checkin: string;
  start: string;
  end: string;
  date: {
    start: string;
    end: string;
  }
  acmurl: string;
}

export type { StandardResponse, ErrorResponse, Data, EventDetails };
